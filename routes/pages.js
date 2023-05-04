const express = require('express');
const router = express.Router();
const pool = require('./dbconfig');
const session = require('express-session'); // used in creating a session for login
const crypto = require('crypto'); // used to crypt secret in cookies
const { render } = require('./pagesreq');
const mysecret = crypto.randomBytes(32).toString('hex');
router.use(session({
    secret: mysecret,
    resave: false,
    saveUninitialized: true
  }))



router.get("/", (req, res) => { // uses "/" as path to index.hbs
    res.render("index")
})
router.get("/register", (req, res) => { // uses /register as path to register.hbs
    res.render("register")
})
router.get("/login", (req, res) => { // uses /login as path to login.hbs
    res.render( "login")
})

router.get("/loggedin", (req, res) => {
  if (req.session.familyhead){
    const email = req.session.emaillogin;
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
      if (error) console.log(error);
      else {
        res.render('loggedin', {familyheadtable: results})
      }
    })
  } else if (req.session.familymember) {
    const email = req.session.emaillogin;
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
      if (error) console.log(error);
      else {
        res.render('loggedin', {familyheadtable: results})
      }
    })
  }
  else if(!req.session.familymember || !req.session.familyhead){
    return res.redirect("/")
  }
  else {
    return res.redirect("/")
  }
})

router.get("/verificationReq", (req, res) => {
   res.render("verificationReq")
})

router.get("/verificationSub", (req, res) => {
  const email = req.session.email;
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if(error) console.log(error);
    else {
      res.render('verificationSub', {phonenumber: results});
    }
  })
})

router.get("/changepassword", (req, res) => {
    if (!req.session.loggedIn){
        return res.redirect("/");
      }
    res.render('changepassword')
})

router.get("/personalinfo", (req, res) => {
if (req.session.familymember) {
    const email = req.session.emaillogin;
    pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
      if (error) console.log(error);
      else {
        pool.query("SELECT * FROM pendingcertificates WHERE email = ?", [email], (error, results2) => {
          if (error) console.log(error)
          else{
            res.render('personalinfo', {familyheadtable: results, pendingcert: results2})
          }
        })
        
      }
    })
  } else if (!req.session.familyhead || !req.session.familymember) {
    return res.redirect("/");
  }
  
})

router.get("/familymember", (req, res) => {
  res.render("familymember")
})

router.get("/admhome", (req, res) => {
  if (!req.session.admin){
    return res.redirect("/");
  }
  res.render("admhome")
})

router.get("/chmhome", (req, res) => {
  if (!req.session.kapadmin){
    return res.redirect("/");
  }
  res.render("chmhome")
})

router.get("/admannouncements", (req, res) => {
  if (req.session.admin === true){
    res.render("admannouncements")
  }
  else if (req.session.kapadmin === true){
    res.render("admannouncements")
  } else if (!req.session.admin || !req.session.kapadmin){
    return res.redirect("/")
  }
})

router.get("/announcements", (req, res) => {
  if (req.session.familyhead){
      pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results1) => {
      if(error) console.log(error);
      pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results2) => {
        if(error) console.log(error);
        pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results3) => {
          if(error) console.log(error);
          pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results4) => {
            if(error) console.log(error);
              res.render('announcements', {news1: results1, news2: results2, events1: results3, events2: results4})
          })
        })
      })
    })
  }
  else if (req.session.familymember){
    pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results1) => {
      if(error) console.log(error);
      pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results2) => {
        if(error) console.log(error);
        pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results3) => {
          if(error) console.log(error);
          pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results4) => {
            if(error) console.log(error);
              res.render('announcements', {news1: results1, news2: results2, events1: results3, events2: results4})
          })
        })
      })
    })
  } else if (!req.session.familyhead || !req.session.familymember) {
    return res.redirect("/");
  }
})

router.get("/successfulchange", (req, res) => {
  res.render("successfulchange")
})

router.get("/termsandcondi", (req, res) => {
  res.render("termsandcondi")
})

router.get("/successfulregister", (req, res) => {
  res.render("successfulregister")
})

router.get("/barangayofficials", (req, res) => {
  res.render("barangayofficials")
})

router.get("/certificates", (req, res) => {
  if (req.session.familyhead){
    res.render("certificates")
  }
  else if (req.session.familymember){
    res.render("certificates")
  } else if (!req.session.familyhead || !req.session.familymember){
    res.redirect("/")
  }
})

router.get("/test", (req, res) => {
  pool.query("SELECT * FROM testtable", (error, results) =>{
    if(error) console.log(error)
    else {
      res.render("test", {output: results});
    }
  })
})

router.get("/admcertificates", (req, res) => {
  if(!req.session.admin) res.redirect("/")
  pool.query("SELECT * FROM pendingcertificates", (error, results) => {
    if(error) console.log(error);
    else{
      const email = results[0].email
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results2) => {
        if(error) console.log(error)
        else {
          if (results2.length > 0) {
            res.render("admcertificates", {certificates: results, names: results2})
          }
          else{
            pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results3) => {
              if(error) console.log(error)
              else {
                if (results3.length > 0) {
                  res.render("admcertificates", {certificates: results, name: results3})
                }
              }
            })
          }
        }
      })
    }
  })
  
})

router.get("/chmannouncements", (req, res) => {
  res.render("chmannouncements")
})

router.get("/chmcertificates", (req, res) => {
  if(!req.session.kapadmin) res.redirect("/")
  pool.query("SELECT * FROM pendingcertificates", (error, results) => {
    if(error) console.log(error);
    else{
      const email = results[0].email
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results2) => {
        if(error) console.log(error)
        else {
          if (results2.length > 0) {
            res.render("chmcertificates", {certificates: results, names: results2})
          }
          else{
            pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results3) => {
              if(error) console.log(error)
              else {
                if (results3.length > 0) {
                  res.render("chmcertificates", {certificates: results, name: results3})
                }
              }
            })
          }
        }
      })
    }
  })
})

router.get("/chmaddadmin", (req, res) => {
  if (!req.session.kapadmin) {
    res.redirect("/")
  }else {
    pool.query("SELECT * FROM admintable", (error, results) => {
      if (error) console.log(error)
      else {
        res.render("chmaddadmin", {admins: results})
      }
    })
  }
})

router.get("/headhome", (req, res) => {
  res.render("headhome")
})

router.get("/headannouncements", (req, res) => {
  if (req.session.familyhead){
    pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results1) => {
    if(error) console.log(error);
    pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results2) => {
      if(error) console.log(error);
      pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results3) => {
        if(error) console.log(error);
        pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results4) => {
          if(error) console.log(error);
            res.render('headannouncements', {news1: results1, news2: results2, events1: results3, events2: results4})
        })
      })
    })
  })
}
else if (req.session.familymember){
  pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results1) => {
    if(error) console.log(error);
    pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results2) => {
      if(error) console.log(error);
      pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results3) => {
        if(error) console.log(error);
        pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results4) => {
          if(error) console.log(error);
            res.render('headannouncements', {news1: results1, news2: results2, events1: results3, events2: results4})
        })
      })
    })
  })
} else if (!req.session.familyhead || !req.session.familymember) {
  return res.redirect("/");
}
})

router.get("/headbarangayofficials", (req, res) => {
  res.render("headbarangayofficials")
})

router.get("/headpersonalinfo", (req, res) => {
  if (req.session.familyhead){
    const email = req.session.emaillogin;
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
      if (error) console.log(error);
      else {
        pool.query("SELECT * FROM pendingcertificates WHERE email = ?", [email], (error, results2) => {
          if (error) console.log(error)
          else{
            res.render('headpersonalinfo', {familyheadtable: results, pendingcert: results2})
          }
        })
        
      }
    })
  } else if (!req.session.familyhead || !req.session.familymember) {
    return res.redirect("/");
  }
  
})

router.get("/headcertificates", (req, res) => {
  res.render("headcertificates")
})

router.get("/headviewmembers", (req, res) => {
  if (!req.session.familyhead) {
    res.redirect("/")
  }else {
    const emailogin = req.session.emaillogin
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [emailogin], async (error, resultss) => {
      if(error) console.log(error);
      else{
          const familycode = req.session.familycode 
          pool.query("SELECT * FROM familymembertable WHERE familycode = ?", [familycode], (error, results) => {
          if (error) console.log(error)
          else {
            res.render("headviewmembers", {familymembers: results, familyhead:resultss})
          }
        })
      }
    })
    
  }
  
})

router.get("/headtermsandcondi", (req, res) => {
  res.render("headtermsandcondi")
})

router.get("/headregister", (req, res) => {
  res.render("headregister")
})

router.get("/headsuccessfulregister", (req, res) => {
  res.render("headsuccessfulregister")
})

router.get("/headapplyresidency", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplyresidency", {info: results})
    }
  })
})

router.get("/headapplyclearance", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplyclearance", {info: results})
    }
  })
})

router.get("/headapplyindigent", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplyindigent", {info: results})
    }
  })
})

router.get("/headapplynewbspermit", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplynewbspermit", {info: results})
    }
  })
})

router.get("/headapplyrenewbspermit", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplyrenewbspermit", {info: results})
    }
  })
})

router.get("/membapplyresidency", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplyresidency", {info: results})
    }
  })
})

router.get("/membapplyclearance", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplyclearance", {info: results})
    }
  })
})

router.get("/membapplyindigent", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplyindigent", {info: results})
    }
  })
})

router.get("/membapplynewbspermit", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplynewbspermit", {info: results})
    }
  })
})

router.get("/membapplyrenewbspermit", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplyrenewbspermit", {info: results})
    }
  })
})

router.get("/admcertclearance", (req,res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertclearance", {data: results, certificate: certresult})
        })
        
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertclearance", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})

router.get("/admcertindigent", (req, res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertindigent", {data: results, certificate: certresult})
        })
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertindigent", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})

router.get("/admcertrenewbspermit", (req, res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertrenewbspermit", {data: results, certificate: certresult})
        })
        
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertrenewbspermit", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})

router.get("/admcertresidency", (req, res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertresidency", {data: results, certificate: certresult})
        })
        
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertresidency", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})

router.get("/admcertnewbspermit", (req, res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertnewbspermit", {data: results, certificate: certresult})
        })
        
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertnewbspermit", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})
module.exports = router;