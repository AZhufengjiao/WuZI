-- 添加用户列表                   ----------------------------------------------------------------------------------------------------------------------    用户列表      -------------------------------------------------------------------------------------
CREATE TABLE `user`(
	`id` INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`username` VARCHAR(20) DEFAULT NULL,
	`password` VARCHAR(40) DEFAULT NULL,
	`mobile` VARCHAR(25) DEFAULT NULL,
	`email` VARCHAR(25) DEFAULT NULL,
	`address` VARCHAR(25)DEFAULT NULL,
	`role` BOOLEAN DEFAULT 0 ,
	`state` BOOLEAN DEFAULT 1
)ENGINE=INNODB DEFAULT CHARSET=utf8;

# 添加数据
INSERT INTO USER  VALUES(9,'admin','123123','13995864269','123@qq.com',1,1)
INSERT INTO USER  VALUES(6,'周子轩','123123','13995864569','123@qq.com',0,1)
INSERT INTO USER  VALUES(3,'周子轩2','123123','13995864569','123@qq.com',TRUE,1)
INSERT INTO USER(username,PASSWORD,mobile,email,role) 
VALUES('张三','123123','13995864582','123@qq.com',FALSE,1),
('李四','123123','13875468529','111@qq.com',TRUE,1),
('王五','123123','13025654585','130@qq.com',FALSE,1),
('王麻子','123123','13025654585','130@qq.com',FALSE,1),
('赵六','123123','13025654585','130@qq.com',FALSE,1)

-- 用户查询，根据用户名查询
SELECT * FROM USER WHERE username='小布丁';
-- 用户登录 查询名称和密码
SELECT * FROM USER WHERE username='小布丁' AND PASSWORD='1232123'

-- 查询用户列表数据
SELECT id,username,mobile,role,email,state  FROM USER  ORDER BY id LIMIT 2
-- 查询用户列表总total
SELECT COUNT(id) AS total  FROM USER
-- 删除单个用户
DELETE FROM USER WHERE id=13
-- 修改数据state
UPDATE USER SET state=NOT state WHERE id=3
-- 修改数据
UPDATE USER SET username='花花酱3',mobile='13995865110',email='112@qq.com',role=1 WHERE id=3
-- 模糊查询用户名
SELECT * FROM USER WHERE username LIKE '%1%' ORDER BY id LIMIT 0,10


-- check
ALTER TABLE emp ADD CONSTRAINT ck_emp_sex CHECK
(sex ='男' OR sex='女')；




-- 添加用户捐赠列表                         ---------------------------------------------------------------------------------------------------------------------    捐赠物资列表哦      -------------------------------------------------------------------------------------
CREATE TABLE `userDonate`(
	`did` INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- 捐赠id
	`id` INT( 11 ) NOT NULL ,-- 用户捐赠id
	`username` VARCHAR(20) DEFAULT NULL,    -- 用户姓名
	`goodname` VARCHAR(25) DEFAULT NULL,    -- 物资名
	`address` VARCHAR(25)DEFAULT NULL,   -- 地址
	`types` BOOLEAN DEFAULT 0 ,  -- 物品是0   现金是1
	`quantity` INT(25) DEFAULT NULL,  -- 物资数量
	`price` INT(25) DEFAULT NULL, -- 现金数量
	 RepDate DATETIME   -- 日期，如‘c’  
)ENGINE=INNODB DEFAULT CHARSET=utf8;


-- 添加数据                      
CREATE TABLE `totalmaterial`(
INSERT INTO userDonate  VALUES(1,12,'花花','手机','湖北 孝感' ,0 ,10,0,NOW() )
INSERT INTO userDonate( id,username,goodname,address,`types`,quantity,price,RepDate) 
VALUES(7,'布丁','现金','湖北 云梦',1,0,12000,'2051-05-07 13:20:12'),(7,'布丁','现金','湖北 云梦',1,0,12000,'2012-05-07 13:20:12')

-- 查询用户捐赠列表                      
SELECT * FROM userdonate ORDER BY did LIMIT 0,1
-- 查询用户列表总total
SELECT COUNT(did) AS total  FROM userdonate
-- 模糊查询用户名
SELECT * FROM userdonate WHERE username LIKE '%11123%' ORDER BY did LIMIT 0,10
-- 查询用户列表总total
SELECT COUNT(did) AS total  FROM userdonate WHERE  username LIKE '%花花%'
-- 查询某捐赠用户id
SELECT * FROM userdonate WHERE id= 12   ORDER BY did LIMIT 0,10
-- // 查询某捐赠用户id总数
SELECT COUNT(did) AS total  FROM userdonate WHERE  id = 12
-- 查询捐赠用户名
SELECT * FROM userdonate WHERE  username='花花'


SHOW VARIABLES LIKE '%time_zone%';

SET GLOBAL system_time_zone = 'UTC';
FLUSH PRIVILEGES;
SELECT VERSION();
SET GLOBAL time_zone = '+8:00';

SELECT NOW()


-- 添加总物资列表                        ----------------------------------------------------------------------------------------------------------------------    总物资      -------------------------------------------------------------------------------------
CREATE TABLE `totalmaterial`(
	`tid` INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- 物资id
	`id` INT( 11 ) NOT NULL ,-- 用户捐赠id
	`username` VARCHAR(20) DEFAULT NULL,    -- 用户姓名
	`materialname` VARCHAR(25) DEFAULT NULL,    -- 物资名
	`type` BOOLEAN DEFAULT 0 ,  -- 物品是0   现金是1
	`quantity` INT(25) DEFAULT NULL,  -- 物资数量
	`price` INT(25) DEFAULT NULL, -- 现金数量 
	`state` BOOLEAN DEFAULT 0
)ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO totalmaterial  VALUES(1,12,'花花','手机',0 ,10,0,0)
INSERT INTO totalmaterial( id,username,materialname, `type`,quantity,price,state ) 
VALUES(12,'花花','手机',0 ,10,0,0),(NULL,'花花','手机',0 ,1000,0,0),(12,'花花','现金',1 , 0,100,0),(NULL,'花花','现金',1 ,0,1000,0),
(16,'admin','口罩',0 ,1300,0,0),(13,'11113223','泡面',0 ,1000,0,0),(16,'admin','现金',1 , 0,200,0),(17,'1321','手套',0 ,10,0,0)

-- 获取总物资数据
SELECT  COUNT(1) AS 'count' ,materialname ,`type` ,SUM(quantity) AS quantity, SUM(price)AS price FROM totalmaterial   GROUP BY materialname LIMIT 0,10
-- // 查询总物资总数
SELECT COUNT(tid) AS total  FROM totalmaterial 
-- // 模糊查询物资名
SELECT * FROM totalmaterial WHERE materialname LIKE '%手机%' ORDER BY tid LIMIT 0,10
-- // 查询某捐赠用户id总数
SELECT COUNT(tid) AS total  FROM totalmaterial WHERE  materialname LIKE '手机'
-- 删除单个物资
DELETE FROM totalmaterial WHERE tid=12
-- 修改物资数据
UPDATE totalmaterial SET materialname='口罩n95',quantity='1200',TYPE='0',username='admin1212' WHERE tid=9
UPDATE totalmaterial SET quantity=0 WHERE TYPE=1
-- 选择改变state
UPDATE totalmaterial SET state=NOT state WHERE tid=1
-- 删除state为1的
DELETE FROM totalmaterial WHERE state=1

-- 负责人                ----------------------------------------------------------------------------------------------------------------------    负责人      -------------------------------------------------------------------------------------
CREATE TABLE `principal`(
	`pid` INT( 11 )  NOT NULL AUTO_INCREMENT PRIMARY KEY ,-- 负责人id
	`username` VARCHAR(20) DEFAULT NULL   -- 负责人姓名
)ENGINE=INNODB DEFAULT CHARSET=utf8;
INSERT INTO principal( pid,username ) 
VALUES(1001,'花花'),(1002,'布丁'),(1003,'如花'),(1004,'小小布丁'),(1005,'黑猫')
-- 删除表
DROP TABLE  principal

-- 稀缺物资             ------------------------------------------------------------------------------------------------------------------------   稀缺物资     ------------------------------------------------------------------------------
CREATE TABLE `materialsScarcity`(
	`sid` INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- 稀缺物资id
	`pid` INT( 11 ) NOT NULL ,-- 负责人pid
	 `date` DATETIME  NOT NULL ,   -- 日期，如‘c’ 
	`username` VARCHAR(20) DEFAULT NULL,    -- 物资名
	`quantity` INT(25) DEFAULT NULL,  -- 物资数量
	`state` INT(25) DEFAULT NULL -- 采购状态
)ENGINE=INNODB DEFAULT CHARSET=utf8;
-- 添加稀缺物资数据
INSERT INTO materialsScarcity( sid,pid,`date`,username,quantity, `state`  ) 
VALUES(1,1004,'2022-03-20','口罩',1000 ,0),(2,1001,'2022-03-20','泡面',1000 ,0),(3,1005,'2022-03-20','矿泉水',1000 ,0),(4,1002,'2022-03-20','棉衣',1000 ,0)

-- 删除稀缺物资表
DROP TABLE  principal
-- 查询稀缺物资
SELECT  * FROM  materialsScarcity  LIMIT 0,10