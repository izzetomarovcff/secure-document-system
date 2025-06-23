require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const config = require("../config.json")
const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.base_password,
  database: config.base,
});

cron.schedule('50 17 * * *', () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(__dirname, `./backups/backup-${timestamp}.sql`);
  const dumpCommand = `"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump" -u${config.user} -p${config.base_password} ${config.base} > "${backupFile}"`;


  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Backup error: ${error.message}`);
      return;
    }
    console.log(`✅ Database backup created at ${backupFile}`);
  });
}, {
  timezone: 'Asia/Baku'
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT users.*, 
           roles.id AS role_id, 
           roles.role_name AS role,
           administrations.administration_name,
           departments.department_name
    FROM users
    JOIN roles ON users.role_id = roles.id
    JOIN administrations ON users.administration_id = administrations.id
    JOIN departments ON users.department_id = departments.id
    WHERE users.username = ?
  `;

  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(404).json({ error: '❌ İstifadəçi Tapılmadı' });
    }

    const user = results[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      if (password == user.password) {

      } else {


        return res.status(401).json({ error: '❌ Şifrə Yalnışdır!' });

      }
    }

    const roleId = user.role_id;
    const userInfo = {
      id: user.id,
      role: user.role,
      name: user.name,
      surname: user.surname,
      fathername: user.fathername,
      phone_number: user.phone_number,
      administration_id: user.administration_id,
      department_id: user.department_id,
      administration_name: user.administration_name,
      department_name: user.department_name,
      role_id: roleId
    };

    // Fetch permissions for this role
    const permQuery = `
      SELECT permissions.name
      FROM permissions
      JOIN role_permissions ON permissions.id = role_permissions.permission_id
      WHERE role_permissions.role_id = ?
    `;

    db.query(permQuery, [roleId], (permErr, permResults) => {
      if (permErr) return res.status(500).json({ error: 'Permission query error' });

      const permissions = permResults.map(row => row.name);

      // Include everything in JWT
      const token = jwt.sign(
        {
          ...userInfo,
          permissions
        },
        'manitoring',
        { expiresIn: '1h' }
      );

      // Return all data to frontend
      res.json({
        message: 'Login successful',
        token,
        ...userInfo,
        permissions,

      });
    });
  });
});
app.post('/addadministration', (req, res) => {
  const { administration_name } = req.body;
  if (!administration_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'INSERT INTO administrations (administration_name,deleted_administration) VALUES (?,0)';
  const values = [administration_name];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'administration added successfully', userId: result.insertId });
  });
});
app.post('/adddepartment', (req, res) => {
  const { department_name, administration_id } = req.body;
  if (!administration_id || !department_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'INSERT INTO departments (department_name,administration_id, deleted_department) VALUES (?,?,0)';
  const values = [department_name, administration_id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'department added successfully', userId: result.insertId });
  });
});
app.post('/addcriterion', (req, res) => {
  const {
    criterion_name,
    criterion_description,
    reversed,
    unit_id,
    age_effect,
    so_bad_min,
    so_bad_max,
    bad_min,
    bad_max,
    good_min,
    good_max,
    best_min,
    best_max,
    ages_options
  } = req.body;

  if (!criterion_name || !criterion_description || !unit_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO criterions (criterion_name, criterion_description, reversed, unit_id, age_effect, so_bad_min, so_bad_max, bad_min, bad_max, good_min, good_max, best_min, best_max, deleted_criterion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,0)';
  const values = [criterion_name, criterion_description, reversed, unit_id, age_effect, so_bad_min, so_bad_max, bad_min, bad_max, good_min, good_max, best_min, best_max];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error (criterions)' });

    const criterionId = result.insertId;

    if (!ages_options || ages_options.length === 0) {
      return res.json({ message: 'Criterion added without age options', criterionId });
    }

    let completed = 0;
    let hasError = false;

    for (let i = 0; i < ages_options.length; i++) {
      const age = ages_options[i];
      const ageQuery = 'INSERT INTO age_evaluations (min_age, max_age, so_bad_min, so_bad_max, bad_min, bad_max, good_min, good_max, best_min, best_max, criterion_id, deleted_age_evaluation) VALUES (?,?,?,?,?,?,?,?,?,?,?,0)';
      const ageValues = [
        age.min_age,
        age.max_age,
        age.so_bad_min,
        age.so_bad_max,
        age.bad_min,
        age.bad_max,
        age.good_min,
        age.good_max,
        age.best_min,
        age.best_max,
        criterionId
      ];

      db.query(ageQuery, ageValues, (err) => {
        if (hasError) return;

        if (err) {
          hasError = true;
          return res.status(500).json({ error: 'Database error (age_evaluations)' });
        }

        completed++;

        if (completed === ages_options.length) {
          // All age options inserted
          res.json({ message: 'Criterion and age evaluations added successfully', criterionId });
        }
      });
    }
  });
});
app.post('/addresults', (req, res) => {
  const {
    results_owner_id,
    results_date,
    results_option
  } = req.body;

  if (!results_owner_id || !results_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO results (results_owner_id, results_date,  deleted_results) VALUES (?,?,0)';
  const values = [results_owner_id,results_date];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error (criterions)' });

    const results_id = result.insertId;

    if (!results_option || results_option.length === 0) {
      return res.json({ message: 'Criterion added without age options', results_id });
    }

    let completed = 0;
    let hasError = false;

    for (let i = 0; i < results_option.length; i++) {
      const resulty = results_option[i];
      const resultQuery = 'INSERT INTO result (user_id,result,result_owner_id,criterion_id,result_date,results_id,deleted_result) VALUES (?,?,?,?,?,?,0)';
      const resultValues = [
        Number(resulty.user_id),
        Number(resulty.result),
        Number(resulty.result_owner_id),
        Number(resulty.criterion_id),
        resulty.result_date,
        results_id
      ];

      db.query(resultQuery, resultValues, (err) => {
        if (hasError) return;

        if (err) {
          hasError = true;
          return res.status(500).json({ error: 'Database error (age_evaluations)' });
        }

        completed++;

        if (completed === results_option.length) {
          // All age options inserted
          res.json({ message: 'Criterion and age evaluations added successfully', results_id });
        }
      });
    }
  });
});
app.post('/adduser', (req, res) => {

  const { username, password, role_id, name, surname, fathername, phone_number, administration_id, department_id, birth_day } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    const query = 'INSERT INTO users (username,password,role_id,name,surname,fathername,phone_number,administration_id,department_id,birth_day,deleted_user) VALUES (?,?,?,?,?,?,?,?,?,?,0)';
    const values = [username, hash, role_id, name, surname, fathername, phone_number, administration_id, department_id, birth_day];
    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'department added successfully', userId: result.insertId });
    });
  });

});
app.post("/getadministrations", (req, res) => {
  const query = 'SELECT * FROM administrations';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Idarə Tapılmadı' });
    }
    res.json(results);
  });
})
app.post("/getevaluations", (req, res) => {
  const query = 'SELECT a.*,c.criterion_name  FROM age_evaluations a JOIN criterions c ON a.criterion_id=c.id';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Idarə Tapılmadı' });
    }
    res.json(results);
  });
})
app.post("/getunits", (req, res) => {
  const query = 'SELECT * FROM units';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'vahid Tapılmadı' });
    }
    res.json(results);
  });
})
app.post("/getcriterions", (req, res) => {
  const query = 'SELECT c.*,u.unit_name FROM criterions c JOIN units u ON c.unit_id = u.id';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'vahid Tapılmadı' });
    }
    res.json(results);
  });
})
app.post("/getdepartments", (req, res) => {
  const query = 'SELECT d.id, d.department_name, a.administration_name, d.deleted_department, a.deleted_administration FROM departments d JOIN administrations a ON d.administration_id = a.id';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Şövbə Tapılmadı' });
    }
    res.json(results);
  });
})
app.post("/getusers", (req, res) => {
  const query = 'SELECT 	u.id,u.username,	u.password,	u.role_id,	r.role_name,	u.name,	u.surname,	u.fathername,	u.phone_number,	u.administration_id,u.birth_day,	a.administration_name,	u.department_id,	d.department_name, u.deleted_user FROM users u JOIN roles r ON u.role_id = r.id JOIN administrations a ON u.administration_id = a.id JOIN departments d ON u.department_id = d.id';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Istifadeci Tapılmadı' });
    }
    res.json(results);
  });
})
app.post("/getusersbysearch", (req, res) => {
  const { search } = req.body;

  const searchCondition = search
    ? `WHERE u.username LIKE ? OR u.name LIKE ? OR u.surname LIKE ? OR u.fathername LIKE ?`
    : "";

  const query = `
    SELECT 
      u.id, u.username, u.password, u.role_id, r.role_name,
      u.name, u.surname, u.fathername, u.phone_number,
      u.administration_id, u.birth_day, a.administration_name,
      u.department_id, d.department_name, u.deleted_user
    FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN administrations a ON u.administration_id = a.id
    JOIN departments d ON u.department_id = d.id
    ${searchCondition}
  `;

  const values = search
    ? Array(4).fill(`%${search}%`)
    : [];

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Istifadeci Tapılmadı' });
    }
    res.json(results);
  });
});
app.post("/getroles", (req, res) => {
  const query = 'SELECT * FROM roles';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Rol Tapılmadı' });
    }
    res.json(results);
  });
})
app.post("/getpermissions", (req, res) => {
  const query = 'SELECT * FROM permissions';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Rol Tapılmadı' });
    }
    res.json(results);
  });
})
app.post('/getrolepermissions', (req, res) => {
  const { role_id } = req.body;
  if (!role_id) {
    return res.status(400).json({ error: 'Rol təyin edilməyib!' });
  }
  const query = 'SELECT p.id, p.name FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE rp.role_id = ?';
  db.query(query, [role_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Icazə Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/getdepartmentsbyadminstrationid', (req, res) => {
  const { administration_id } = req.body;
  if (!administration_id) {
    return res.status(400).json({ error: 'Email təyin edilməyib!' });
  }
  const query = 'SELECT d.id, d.department_name, d.administration_id, d.deleted_department,a.deleted_administration FROM departments d JOIN administrations a ON d.administration_id = a.id WHERE administration_id = ?';
  db.query(query, [administration_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Şöbə Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/getageevaluationsbycriterionid', (req, res) => {
  const { criterion_id } = req.body;
  if (!criterion_id) {
    return res.status(400).json({ error: 'Email təyin edilməyib!' });
  }
  const query = 'SELECT * FROM age_evaluations WHERE criterion_id = ?;';
  db.query(query, [criterion_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Şöbə Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/getadministrationbyid', (req, res) => {
  const { administration_id } = req.body;
  if (!administration_id) {
    return res.status(400).json({ error: 'Email təyin edilməyib!' });
  }
  const query = 'SELECT * FROM administrations WHERE id = ?';
  db.query(query, [administration_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'İdarə Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/getdepartmentbyid', (req, res) => {
  const { department_id } = req.body;
  if (!department_id) {
    return res.status(400).json({ error: 'Email təyin edilməyib!' });
  }
  const query = 'SELECT * FROM departments WHERE id = ?';
  db.query(query, [department_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'şövbə tapılmadı Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/getcriterionbyid', (req, res) => {
  const { criterion_id } = req.body;
  if (!criterion_id) {
    return res.status(400).json({ error: 'Email təyin edilməyib!' });
  }
  const query = 'SELECT * FROM criterions WHERE id = ?';
  db.query(query, [criterion_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'şövbə tapılmadı Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/getuserbyid', (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'Email təyin edilməyib!' });
  }
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'şövbə tapılmadı Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/updateadministration', (req, res) => {
  const { id, administration_name } = req.body;
  if (!id || !administration_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'UPDATE administrations SET administration_name = ? WHERE id = ?';
  const values = [administration_name, id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Administration not found' });
    }

    res.json({ message: 'Administration updated successfully' });
  });
});
app.post('/updatecriterions', (req, res) => {
  const { id, criterion_name, criterion_description, reversed, unit_id, age_effect, so_bad_min, so_bad_max, bad_min, bad_max, good_min, good_max, best_min, best_max, ages_options } = req.body;
  if (!id || !criterion_name || !criterion_description || !unit_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (age_effect) {
    const query = 'UPDATE criterions SET criterion_name = ?,criterion_description = ?,reversed = ?,unit_id = ?,age_effect = ?,so_bad_min = ?,so_bad_max = ?,bad_min = ?,bad_max = ?,good_min = ?,good_max = ?,best_min = ?,best_max = ? WHERE id = ?';
    const values = [criterion_name, criterion_description, reversed, unit_id, age_effect, so_bad_min, so_bad_max, bad_min, bad_max, good_min, good_max, best_min, best_max, id];
    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Administration not found' });
      }
      res.json({ message: 'Administration updated successfully' });
    });
    for (let i = 0; i < ages_options.length; i++) {
      if (ages_options[i].id) {
        const age = ages_options[i]
        const ageQuery = 'UPDATE age_evaluations SET min_age = ?,max_age = ?,so_bad_min = ?,so_bad_max = ?,bad_min = ?,bad_max = ?,good_min = ?,good_max = ?,best_min = ?,best_max = ? WHERE id = ?'
        const agesValues = [
          age.min_age,
          age.max_age,
          age.so_bad_min,
          age.so_bad_max,
          age.bad_min,
          age.bad_max,
          age.good_min,
          age.good_max,
          age.best_min,
          age.best_max,
          age.id
        ]
        db.query(ageQuery, agesValues, (err, result) => {
          // if (err) return res.status(500).json({ error: 'Database error' });
          if (result.affectedRows === 0) {
            // return res.status(404).json({ error: 'Administration not found' });
          }
          // res.json({ message: 'Administration updated successfully' });
        });
      } else {
        const age = ages_options[i];
        const ageQuery = 'INSERT INTO age_evaluations (min_age, max_age, so_bad_min, so_bad_max, bad_min, bad_max, good_min, good_max, best_min, best_max, criterion_id, deleted_age_evaluation) VALUES (?,?,?,?,?,?,?,?,?,?,?,0)';
        const ageValues = [
          age.min_age,
          age.max_age,
          age.so_bad_min,
          age.so_bad_max,
          age.bad_min,
          age.bad_max,
          age.good_min,
          age.good_max,
          age.best_min,
          age.best_max,
          id
        ];
        db.query(ageQuery, ageValues, (err, result) => {
          // if (err) return res.status(500).json({ error: 'Database error' });

          if (result.affectedRows === 0) {
            // return res.status(404).json({ error: 'Administration not found' });
          }

          // res.json({ message: 'Administration updated successfully' });
        });

      }
    }

  } else {
    const query = 'UPDATE criterions SET criterion_name = ?,criterion_description = ?,reversed = ?,unit_id = ?,age_effect = ?,so_bad_min = ?,so_bad_max = ?,bad_min = ?,bad_max = ?,good_min = ?,good_max = ?,best_min = ?,best_max = ? WHERE id = ?';
    const values = [criterion_name, criterion_description, reversed, unit_id, age_effect, so_bad_min, so_bad_max, bad_min, bad_max, good_min, good_max, best_min, best_max, id];

    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Administration not found' });
      }

      res.json({ message: 'Administration updated successfully' });
    });
  }


});
app.post('/deleteadministration', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'UPDATE administrations SET deleted_administration = 1 WHERE id = ?';
  const values = [id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Administration not found' });
    }
    res.json({ message: 'Administration updated successfully' });
  });
});
app.post('/deletecriterion', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'UPDATE criterions SET deleted_criterion = 1 WHERE id = ?';
  const values = [id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'kriteriya not found' });
    }
    res.json({ message: 'kriteriya updated successfully' });
  });
});
app.post('/deleteageevaluation', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'UPDATE age_evaluations SET deleted_age_evaluation = 1 WHERE id = ?';
  const values = [id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'kriteriya not found' });
    }
    res.json({ message: 'kriteriya updated successfully' });
  });
});
app.post('/deletedepartment', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'UPDATE departments SET deleted_department = 1 WHERE id = ?';
  const values = [id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Administration not found' });
    }
    res.json({ message: 'Administration updated successfully' });
  });
});
app.post('/deleteuser', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'UPDATE users SET deleted_user = 1 WHERE id = ?';
  const values = [id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Administration not found' });
    }
    res.json({ message: 'Administration updated successfully' });
  });
});
app.post('/updateadepartment', (req, res) => {
  const { id, department_name, administration_id } = req.body;
  if (!id || !department_name || !administration_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'UPDATE departments SET department_name = ?,administration_id = ? WHERE id = ?';
  const values = [department_name, administration_id, id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Administration not found' });
    }
    res.json({ message: 'Administration updated successfully' });
  });
});
app.post('/updatecriterion', (req, res) => {
  const { id, criterion_name, criterion_description, reversed, unit_id, age_effect } = req.body;
  if (!id || !criterion_name || !criterion_description || !unit_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const query = 'UPDATE criterions SET criterion_name = ?,criterion_description = ?,reversed = ?,unit_id = ?,age_effect = ? WHERE id = ?';
  const values = [criterion_name, criterion_description, reversed, unit_id, age_effect, id];
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Administration not found' });
    }
    res.json({ message: 'Administration updated successfully' });
  });
});
app.post("/updaterolepermissions", (req, res) => {
  const { role_id, permissions } = req.body;

  if (!role_id || !Array.isArray(permissions)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const deleteQuery = 'DELETE FROM role_permissions WHERE role_id = ?';
  db.query(deleteQuery, [role_id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete existing permissions' });

    if (permissions.length === 0) {
      return res.json({ message: "Permissions updated (none selected)" });
    }

    const values = permissions.map(permission_id => [role_id, permission_id]);
    const insertQuery = 'INSERT INTO role_permissions (role_id, permission_id) VALUES ?';

    db.query(insertQuery, [values], (insertErr) => {
      if (insertErr) return res.status(500).json({ error: 'Failed to insert new permissions' });

      res.json({ message: "Permissions updated successfully" });
    });
  });
});
app.post('/updateuser', (req, res) => {
  const { id, username, password, role_id, name, surname, fathername, phone_number, administration_id, department_id } = req.body;
  if (!id || !username || !role_id || !name || !surname || !fathername || !phone_number || !administration_id || !department_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (password) {
    bcrypt.hash(password, 10, (err, hash) => {
      const query = 'UPDATE users SET username = ?,password = ?,role_id = ?,name = ?,surname = ?,fathername = ?,phone_number = ?,administration_id = ?,department_id = ? WHERE id = ?';
      const values = [username, hash, role_id, name, surname, fathername, phone_number, administration_id, department_id, id];
      db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Administration not found' });
        }
        res.json({ message: 'Administration updated successfully' });
      });
    });
  } else {
    const query = 'UPDATE users SET username = ?,role_id = ?,name = ?,surname = ?,fathername = ?,phone_number = ?,administration_id = ?,department_id = ? WHERE id = ?';
    const values = [username, role_id, name, surname, fathername, phone_number, administration_id, department_id, id];
    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Administration not found' });
      }
      res.json({ message: 'Administration updated successfully' });
    });
  }

});
///

app.post('/getsendedsbyid', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'id təyin edilməyib!' });
  }
  const query = 'SELECT 	f.*,r.username FROM flow f JOIN users s ON s.id = f.from_id JOIN users r ON r.id = f.to_id WHERE f.from_id=?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Şöbə Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/send', (req, res) => {
  const { title, description, orginal_file_name, secured_file_name, from_id, to_id, cryption, date, time,private_key_file,public_key_file,hash } = req.body;
  if (!title || !description || !orginal_file_name || !secured_file_name || !from_id || !to_id || !cryption || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }


  const query = 'INSERT INTO flow (title, description, orginal_file_name, secured_file_name, from_id, to_id, cryption, date, time, private_key_file, public_key_file,hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [title, description, orginal_file_name, secured_file_name, from_id, to_id, cryption, date, time,private_key_file,public_key_file,hash];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    res.json({ message: 'Flow added successfully', userId: result.insertId });
  });
});
app.post('/getsendedbyid', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'id təyin edilməyib!' });
  }
  const query = 'SELECT 	f.*,r.username FROM flow f JOIN users s ON s.id = f.from_id JOIN users r ON r.id = f.to_id WHERE f.id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'İdarə Tapılmadı' });
    }
    res.json(results);
  });
});

app.post('/getrecivedbyid', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'id təyin edilməyib!' });
  }
  const query = 'SELECT 	f.*,s.username FROM flow f JOIN users s ON s.id = f.from_id JOIN users r ON r.id = f.to_id WHERE f.id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'İdarə Tapılmadı' });
    }
    res.json(results);
  });
});
app.post('/getrecivedsbyid', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'id təyin edilməyib!' });
  }
  const query = 'SELECT 	f.*,s.username FROM flow f JOIN users s ON s.id = f.from_id JOIN users r ON r.id = f.to_id WHERE f.to_id=?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Databaza Sorğu Erroru' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Şöbə Tapılmadı' });
    }
    res.json(results);
  });
});

app.get('/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '../decrypted', fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).send('File not found or download error');
    }
  });
});

app.listen(5000, config.server_ip, () => {
  console.log(`Server started on ${config.server_ip}:5000`);
});
