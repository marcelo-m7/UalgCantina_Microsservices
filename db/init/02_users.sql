
CREATE USER 'student_user'@'%' IDENTIFIED BY 'student_pass';
GRANT SELECT ON cantina.* TO 'student_user'@'%';

CREATE USER 'staff_user'@'%' IDENTIFIED BY 'staff_pass';
GRANT SELECT, INSERT, UPDATE, DELETE ON cantina.* TO 'staff_user'@'%';
