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

namespace Budget.Controllers
{
    public class TransactionsController : ApiController
    {
        budgetEntities _db = new budgetEntities();
        
        [HttpPost]
        public IHttpActionResult GetIncomes([FromUri] bool getIncomes, [FromBody] FilterData data, [FromUri] bool filter = false)
        {
            var Incomes = (from i in _db.transaction_log
                           join t in _db.types on i.type_id equals t.typeID
                           join u in _db.users on i.user_id equals u.userID
                           where t.type_mod == "income"
                           select new TransactionData
                           {
                               transactionID = i.transaction_id,
                               spender = u.name,
                               source = i.source,
                               amount = i.amount,
                               category = t.typeName,
                               date = i.date,
                               description = i.description,
                               reoccur = i.reoccuring
                           }).ToList();

            if (filter == true)
            {
                var filterMonth = data.month;
                var filterYear = data.year;


                if (filterMonth > 0 || filterYear > 0)
                {
                    Incomes = Incomes.Where(i => i.date.Month == filterMonth && i.date.Year == filterYear).ToList(); ;
                }

            }
            if (Incomes.Count > 0)
            {
                return Ok(Incomes);
            }
            else
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        public IHttpActionResult GetExpenses([FromUri] bool getExpenses, [FromBody] FilterData data, [FromUri] bool filter = false)
        {
            var Expenses = (from e in _db.transaction_log
                           join t in _db.types on e.type_id equals t.typeID
                           join u in _db.users on e.user_id equals u.userID
                           where t.type_mod == "expense"
                           select new TransactionData
                           {
                               transactionID = e.transaction_id,
                               spender = u.name,
                               source = e.source,
                               amount = e.amount,
                               category = t.typeName,
                               date = e.date,
                               description = e.description,
                               reoccur = e.reoccuring
                           }).ToList();

            if (filter == true)
            {
                var filterMonth = data.month;
                var filterYear = data.year;


                if (filterMonth > 0 || filterYear > 0)
                {
                    Expenses = Expenses.Where(i => i.date.Month == filterMonth && i.date.Year == filterYear).ToList(); ;
                }

            }
            if (Expenses.Count > 0)
            {
                return Ok(Expenses);
            }
            else
            {
                return InternalServerError();
            }
        }

        [HttpPost]
        public IHttpActionResult GetPurchases([FromUri] bool getPurchases, [FromBody] FilterData data, [FromUri] bool filter = false)
        {
            var Purchases = (from p in _db.transaction_log
                             join t in _db.types on p.type_id equals t.typeID
                             join u in _db.users on p.user_id equals u.userID
                             where t.type_mod == "purchase"
                             select new TransactionData
                             {
                                 transactionID = p.transaction_id,
                                 spender = u.name,
                                 source = p.source,
                                 amount = p.amount,
                                 category = t.typeName,
                                 date = p.date,
                                 description = p.description,
                                 reoccur = p.reoccuring
                             }).ToList();
            if (filter == true)
            {
                var filterMonth = data.month;
                var filterYear = data.year;


                if (filterMonth > 0 || filterYear > 0)
                {
                    Purchases = Purchases.Where(i => i.date.Month == filterMonth && i.date.Year == filterYear).ToList(); ;
                }

            }
            if (Purchases.Count > 0)
            {
                return Ok(Purchases);
            }
            else
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        public IHttpActionResult GetUser([FromUri] bool getUser)
        {
            var LoggedInUser = User.Identity.Name;

            if(LoggedInUser != null)
            {
                return Ok(LoggedInUser);
            }
            else
            {
                return InternalServerError();
            }
        }
    }

    public class TransactionData
    {
        public int transactionID { get; set; }
        public string spender { get; set; }
        public string source { get; set; }
        public decimal amount { get; set; }
        public string category { get; set; }
        public DateTime date { get; set; }
        public string description { get; set; }
        public int? reoccur { get; set; }
    }

    public class FilterData
    {
        public int month { get; set; }
        public int year { get; set; }
    }
}