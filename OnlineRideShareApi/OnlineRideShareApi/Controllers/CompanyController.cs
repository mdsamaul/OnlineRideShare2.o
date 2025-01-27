﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;
using OnlineRideShareApi.Data;
using OnlineRideShareApi.Dtos;
using OnlineRideShareApi.Models;
using System.Security.Claims;

namespace OnlineRideShareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompanyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Company>> GetCompany()
        {
            var company = await _context.Companies.AsNoTracking().ToListAsync();
            return company;
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> CreateCompany(Company company)
        {
            //var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            company.UserId = userId;
            company.SetCreateInfo();
            await _context.AddAsync(company);
            var result = await _context.SaveChangesAsync();
            if(result > 0)
            {
              
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Company create Success.",
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess = false,
                Message="Company Create field"
            });
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Company>> Company(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if(company is null)
            {
                return NotFound();
            }
            return Ok(company);
        }
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Company>> DeleteCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if(company is null)
            {
                return NotFound();
            }
            _context.Companies.Remove(company);
            var result = await _context.SaveChangesAsync();
            if(result > 0)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message= "Company deleted successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess= false,
                Message= "Unable to delete company"
            });
        }
        [AllowAnonymous]
        [HttpPut("{id:int}")]
        //api/companes/1
        public async Task<IActionResult> EditCompany(int id, Company company)
        {
            var companyFromDb = await _context.Companies.FindAsync(id);
            if(companyFromDb is null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess= false,
                    Message= "Company not found"
                });
            }
            companyFromDb.CompanyName = company.CompanyName;
            companyFromDb.Address = company.Address;
            companyFromDb.CompanyPhoneNumber = company.CompanyPhoneNumber;
            companyFromDb.CompanyEmail = company.CompanyEmail;
            companyFromDb.SetUpdateInfo();

            var result = await _context.SaveChangesAsync();
            if (result > 0) {
                return Ok(new AuthResponseDto
                {
                    IsSuccess=true,
                    Message= "Company Update successfully"
                });
            }
            return BadRequest(new AuthResponseDto
            {
                IsSuccess=false,
                Message= "Unable to Company"
            });
        }
        [HttpGet("details")]
        public async Task<ActionResult<Company>> CompanyDetails()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "uaser not auththenticate"
                });
            }
            var company = _context.Companies.Where(cu => cu.UserId == currentUserId);
            if (company is null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "no company found this user"
                });
            }
            return Ok(company);
        }
    }
}
