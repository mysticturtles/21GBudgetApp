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
        public List<TransactionDataModified> GetIncomes([FromUri] bool getIncomes, [FromBody] FilterData data, [FromUri] bool filter = false)
        {
            var IncomesModified = new List<TransactionDataModified>();
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


                if(filterMonth == 0) {
                    Incomes = Incomes.Where(i => i.date.Year == filterYear).ToList(); ;
                } else if (filterMonth > 0 || filterYear > 0)
                {
                    Incomes = Incomes.Where(i => i.date.Month == filterMonth && i.date.Year == filterYear).ToList(); ;
                }

            }
            foreach(TransactionData income in Incomes)
            {
                var DateModified = income.date.ToString("MM-dd-yyyy");
                var incomeId = income.transactionID;
                var incomedata = new TransactionDataModified()
                {
                    transactionID = income.transactionID,
                    spender = income.spender,
                    source = income.source,
                    amount = income.amount,
                    category = income.category,
                    date = DateModified,
                    description = income.description,
                    reoccur = income.reoccur
                };
                IncomesModified.Add(incomedata);

            }
            if(IncomesModified.Count <= 0){
                var fakeIncome = new TransactionDataModified()
                {
                    transactionID = 0,
                    spender = "NO RECORDS",
                    source = "NO RECORDS",
                    amount = 0,
                    category = "NO RECORDS",
                    date = "NO RECORDS",
                    description = "NO RECORDS",
                    reoccur = 0
                };
                IncomesModified.Add(fakeIncome);
            }
            return IncomesModified;
        }

        [HttpPost]
        public List<TransactionDataModified> GetExpenses([FromUri] bool getExpenses, [FromBody] FilterData data, [FromUri] bool filter = false)
        {
            var ExpensesModified = new List<TransactionDataModified>();
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


                if (filterMonth == 0)
                {
                    Expenses = Expenses.Where(i => i.date.Year == filterYear).ToList(); ;
                } else if (filterMonth > 0 || filterYear > 0)
                {
                    Expenses = Expenses.Where(i => i.date.Month == filterMonth && i.date.Year == filterYear).ToList(); ;
                }

            }
            foreach (TransactionData expense in Expenses)
            {
                var DateModified = expense.date.ToString("MM-dd-yyyy");
                var expenseid = expense.transactionID;
                var expensedata = new TransactionDataModified()
                {
                    transactionID = expense.transactionID,
                    spender = expense.spender,
                    source = expense.source,
                    amount = expense.amount,
                    category = expense.category,
                    date = DateModified,
                    description = expense.description,
                    reoccur = expense.reoccur
                };
                ExpensesModified.Add(expensedata);

            }
            if (ExpensesModified.Count <= 0)
            {
                var fakeExpense = new TransactionDataModified()
                {
                    transactionID = 0,
                    spender = "NO RECORDS",
                    source = "NO RECORDS",
                    amount = 0,
                    category = "NO RECORDS",
                    date = "NO RECORDS",
                    description = "NO RECORDS",
                    reoccur = 0
                };
                ExpensesModified.Add(fakeExpense);
            }
            return ExpensesModified;
        }

        [HttpPost]
        public List<TransactionDataModified> GetPurchases([FromUri] bool getPurchases, [FromBody] FilterData data, [FromUri] bool filter = false)
        {
            var PurchasesModified = new List<TransactionDataModified>();
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


                if (filterMonth == 0)
                {
                    Purchases = Purchases.Where(i => i.date.Year == filterYear).ToList(); ;
                } else if (filterMonth > 0 || filterYear > 0)
                {
                    Purchases = Purchases.Where(i => i.date.Month == filterMonth && i.date.Year == filterYear).ToList(); ;
                }

            }
            foreach (TransactionData purchase in Purchases)
            {
                var DateModified = purchase.date.ToString("MM-dd-yyyy");
                var purchaseid = purchase.transactionID;
                var purchasedata = new TransactionDataModified()
                {
                    transactionID = purchase.transactionID,
                    spender = purchase.spender,
                    source = purchase.source,
                    amount = purchase.amount,
                    category = purchase.category,
                    date = DateModified,
                    description = purchase.description,
                    reoccur = purchase.reoccur
                };
                PurchasesModified.Add(purchasedata);

            }
            if (PurchasesModified.Count <= 0)
            {
                var fakePurchase = new TransactionDataModified()
                {
                    transactionID = 0,
                    spender = "NO RECORDS",
                    source = "NO RECORDS",
                    amount = 0,
                    category = "NO RECORDS",
                    date = "NO RECORDS",
                    description = "NO RECORDS",
                    reoccur = 0
                };
                PurchasesModified.Add(fakePurchase);
            }
            return PurchasesModified;
        }

        [HttpGet]
        public IHttpActionResult GetUser([FromUri] bool getUser)
        {
            var LoggedInUser = User.Identity.Name;

            if (LoggedInUser != null)
            {
                return Ok(LoggedInUser);
            }
            else
            {
                return InternalServerError();
            }
        }

        [HttpGet]
        public IHttpActionResult GetBalance([FromUri] bool getBalance, [FromUri] int year)
        {
            var incomeTotal = new Decimal();
            var expenseTotal = new Decimal();
            var purchaseTotal = new Decimal();
            var Balance = new Decimal();
            var filterData = new FilterData();

            filterData.month = 0;
            filterData.year = year;
            List<TransactionDataModified> Incomes = GetIncomes(true, filterData, true);
            List<TransactionDataModified> Expenses = GetExpenses(true, filterData, true);
            List<TransactionDataModified> Purchases = GetPurchases(true, filterData, true);

            foreach (var Income in Incomes)
            {
                incomeTotal += Income.amount;
            }

            foreach (var Expense in Expenses)
            {
                expenseTotal += Expense.amount;
            }
            foreach (var Purchase in Purchases)
            {
                purchaseTotal += Purchase.amount;
            }
            Balance = incomeTotal - (expenseTotal + purchaseTotal);
            if (Balance >= 0)
            {
                return Ok(Balance);
            } else if(Balance <= 0){
                return Ok(Balance);
            } else{
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

    public class TransactionDataModified
    {
        public int transactionID { get; set; }
        public string spender { get; set; }
        public string source { get; set; }
        public decimal amount { get; set; }
        public string category { get; set; }
        public string date { get; set; }
        public string description { get; set; }
        public int? reoccur { get; set; }
    }

    public class FilterData
    {
        public int month { get; set; }
        public int year { get; set; }
    }
}