using Budget.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;



namespace BudgetApp.Controllers
{

    public class DateObjectController : ApiController
    {
        budgetEntities _db = new budgetEntities();

        

        public IHttpActionResult GetMonths([FromUri] bool GetMonth)
        {
            var dateObjects = (from mon in _db.months
                               where mon.active == 1
                               select new Months
                               {
                                   monthName = mon.monthName,
                                   monthInt = mon.month_int
                               }).ToList();

            if (dateObjects.FirstOrDefault() != null)
            {
                return Ok(dateObjects);
            }
            else
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
        }

        public IHttpActionResult GetYears([FromUri] bool GetYear)
        {
            var dateObjects = (from y in _db.years
                               where y.active == 1
                               select new Years
                               {
                                   yearInt = y.yearInt
                               }).ToList();

            if (dateObjects.FirstOrDefault() != null)
            {
                return Ok(dateObjects);
            }
            else
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
        }

        [HttpGet]
        public IHttpActionResult AddYear([FromUri] bool AddYear, [FromUri] int year)
        {
            var Years = (from y in _db.years
                         where y.yearInt == year
                         select new YearData
                         {
                            yearInt = y.yearInt

                         }).ToList ();
            if (Years.FirstOrDefault() != null)
            {
                if (Years.FirstOrDefault().active == 1)
                {
                    return Ok();
                }
                else
                {
                    _db.years.Where(i => i.yearInt == year).FirstOrDefault().active = 1;
                    _db.SaveChanges();
                }
            }
            else
            {
                var yeartoAdd = new year();
                yeartoAdd.active = 1;
                yeartoAdd.yearInt = year;
                _db.years.Add(yeartoAdd);
                _db.SaveChanges();
            }
            var YearsAdded = (from y in _db.years
                         where y.yearInt == year
                         select new YearData
                         {
                             yearInt = y.yearInt
                         }).ToList();
            if(YearsAdded.FirstOrDefault() != null)
            {
                return Created("YearTable", year);

            }
            else
            {
                return InternalServerError();
            }
        }
    }

    public class MonthData
    {
        public string monthName { get; set; }
        public int monthInt { get; set; }
        public int active { get; set; }
    }

    public class YearData
    {
        public int yearInt { get; set; }
        public int active { get; set; }
    }

    public class Years
    {
        public int yearInt { get; set; }
    }

    public class Months
    {
        public string monthName { get; set; }
        public int monthInt { get; set; }
    }
}
