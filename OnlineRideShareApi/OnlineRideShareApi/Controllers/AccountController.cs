using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Models;
using RestSharp;

namespace OnlineRideShareApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AccountController(UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration , AppDbContext context
        )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
           _context = context;
        }
        
        // api/account/register

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new AppUser
            {
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                UserName = registerDto.FullName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            //var id = registerDto.UserId;
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            if (registerDto.Roles is null)
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
            else
            {
                foreach (var role in registerDto.Roles)
                {
                    await _userManager.AddToRoleAsync(user, role);
                }
            } 
            var customer = new Customer()
            {
                UserId= user.Id,
                CustomerName=user.UserName,
                CustomerNID="",
                CustomerPhoneNumber="N/A",
                CustomerEmail=user.Email,
            };
            await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();
            var driver = new Driver()
            {
                UserId = user.Id,
                DriverName=user.UserName,
                Email=user.Email,
            };
            await _context.Drivers.AddAsync(driver);
            await _context.SaveChangesAsync();
            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Account Created Sucessfully!"
            });

        }

        //api/account/login
        [AllowAnonymous]
        [HttpPost("login")]

        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user is null)
            {
                return Unauthorized(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User not found with this email",
                });
            }

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result)
            {
                return Unauthorized(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid Password."
                });
            }


            var token = GenerateToken(user);
            var refreshToken = GenerateRefreshToken();
            _ = int.TryParse(_configuration.GetSection("JWTSetting").GetSection("RefreshTokenValidityIn").Value!, out int RefreshTokenValidityIn);
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(RefreshTokenValidityIn);
            await _userManager.UpdateAsync(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                IsSuccess = true,
                Message = "Login Success.",
                RefreshToken = refreshToken

            });


        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]

        public async Task<ActionResult<AuthResponseDto>> RefreshToken(TokenDto tokenDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var principal = GetPrincipalFromExpiredToken(tokenDto.Token);
            var user = await _userManager.FindByEmailAsync(tokenDto.Email);

            if (principal is null || user is null || user.RefreshToken != tokenDto.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid client request"
                });

            var newJwtToken = GenerateToken(user);
            var newRefreshToken = GenerateRefreshToken();
            _ = int.TryParse(_configuration.GetSection("JWTSetting").GetSection("RefreshTokenValidityIn").Value!, out int RefreshTokenValidityIn);

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(RefreshTokenValidityIn);

            await _userManager.UpdateAsync(user);

            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Token = newJwtToken,
                RefreshToken = newRefreshToken,
                Message = "Refreshed token successfully"
            });
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JwtSetting").GetSection("securityKey").Value!)),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenParameters, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);

            if (user is null)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User does not exist with this email"
                });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = $"http://localhost:4200/reset-password?email={user.Email}&token={WebUtility.UrlEncode(token)}";
            //1 mdsamaul834

            //using RestSharp;

            //var client = new RestClient("https://send.api.mailtrap.io/api/send");
            //var request = new RestRequest();
            //request.AddHeader("Authorization", "Bearer b76bb88cf41ddf11c423b066daa123be");
            //request.AddHeader("Content-Type", "application/json");
            //request.AddParameter("application/json", "{\"from\":{\"email\":\"hello@demomailtrap.com\",\"name\":\"Mailtrap Test\"},\"to\":[{\"email\":\"mdsamaul843@gmail.com\"}],\"template_uuid\":\"432e3855-2ee3-4eba-91c6-351f3acea4bf\",\"template_variables\":{\"user_email\":\"Test_User_email\",\"pass_reset_link\":\"Test_Pass_reset_link\"}}", ParameterType.RequestBody);
            //var response = client.Post(request);
            //System.Console.WriteLine(response.Content);

            //var client = new RestClient("https://send.api.mailtrap.io/api/send");
            //var request = new RestRequest
            //{
            //    Method = Method.Post,
            //    RequestFormat = DataFormat.Json,
            //};
            //request.AddHeader("Authorization", "Bearer b76bb88cf41ddf11c423b066daa123be");
            //request.AddJsonBody(new
            //{
            //    from = new { email = "mailtrap@demomailtrap.com" },
            //    to = new[] { new { email = user.Email } },
            //    template_uuid = "432e3855-2ee3-4eba-91c6-351f3acea4bf",
            //    template_variables = new { user_email = user.Email, pass_reset_link = resetLink }
            //});

            //2 samaul.isdb
            //using RestSharp;

            //var client = new RestClient("https://send.api.mailtrap.io/api/send");
            //var request = new RestRequest();
            //request.AddHeader("Authorization", "Bearer a98586fdc0e1a9d188caa861d81184dc");
            //request.AddHeader("Content-Type", "application/json");
            //request.AddParameter("application/json", "{\"from\":{\"email\":\"hello@demomailtrap.com\",\"name\":\"Mailtrap Test\"},\"to\":[{\"email\":\"samaul.isdb@gmail.com\"}],\"template_uuid\":\"c6445e87-159b-4ab4-b7b2-b1b3680adfb3\",\"template_variables\":{\"user_email\":\"Test_User_email\",\"pass_reset_link\":\"Test_Pass_reset_link\"}}", ParameterType.RequestBody);
            //var response = client.Post(request);
            //System.Console.WriteLine(response.Content);
            var client = new RestClient("https://send.api.mailtrap.io/api/send");
            var request = new RestRequest
            {
                Method = Method.Post,
                RequestFormat = DataFormat.Json,
            };
            request.AddHeader("Authorization", "Bearer a98586fdc0e1a9d188caa861d81184dc");
            request.AddJsonBody(new
            {
                from = new { email = "mailtrap@demomailtrap.com" },
                to = new[] { new { email = user.Email } },
                template_uuid = "c6445e87-159b-4ab4-b7b2-b1b3680adfb3",
                template_variables = new { user_email = user.Email, pass_reset_link = resetLink }
            });

            var response = client.Execute(request);
            if (response.IsSuccessful)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Email sent with password reset link, Please check your email."
                });
            }
            else
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = response.Content!.ToString()
                });
            }
        }
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            // resetPasswordDto.Token = WebUtility.UrlDecode(resetPasswordDto.Token);

            if (user is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User does not exist with this email"
                });
            }

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Password reset Successfully"
                });
            }

            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = result.Errors.FirstOrDefault()!.Description
            });
        }


        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(changePasswordDto.Email);
            if (user is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User does not exist with this email"
                });
            }

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Password changed successfully"
                });
            }

            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message = result.Errors.FirstOrDefault()!.Description
            });
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
        private string GenerateToken(AppUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII
            .GetBytes(_configuration.GetSection("JWTSetting").GetSection("securityKey").Value!);

            var roles = _userManager.GetRolesAsync(user).Result;

            List<Claim> claims =
            [
                new (JwtRegisteredClaimNames.Email,user.Email??""),
                new (JwtRegisteredClaimNames.Name,user.FullName??""),
                new (JwtRegisteredClaimNames.NameId,user.Id ??""),
                new (JwtRegisteredClaimNames.Aud,
                _configuration.GetSection("JWTSetting").GetSection("validAudience").Value!),
                new (JwtRegisteredClaimNames.Iss,_configuration.GetSection("JWTSetting").GetSection("validIssuer").Value!)
            ];


            foreach (var role in roles)

            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                )
            };


            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }
        //api/account/detail
        [HttpGet("detail")]
        public async Task<ActionResult<UserDetailDto>> GetUserDetail()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(currentUserId!);


            if (user is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User not found"
                });
            }

            return Ok(new UserDetailDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Roles = [.. await _userManager.GetRolesAsync(user)],
                PhoneNumber = user.PhoneNumber,
                PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                AccessFailedCount = user.AccessFailedCount,

            });

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDetailDto>>> GetUsers()
        {
            var users = await _userManager.Users.AsNoTracking().ToListAsync();

            var userDetails = new List<UserDetailDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user); 

                var userDetail = new UserDetailDto
                {
                    Id = user.Id,
                    FullName = user.FullName, 
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    TwoFacotrEnabled = user.TwoFactorEnabled,
                    PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                    AccessFailedCount = user.AccessFailedCount,
                    Roles = roles.ToArray() 
                };

                userDetails.Add(userDetail);
            }

            // Return the user details with roles
            return Ok(userDetails);
        }

    }

}