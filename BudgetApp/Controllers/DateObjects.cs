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

        public async Task<IHttpActionResult> Get()
        {
            return Ok(new { Name = "Zachary", Occupation = "Help Desk Analyst" });
        }
    }
}
