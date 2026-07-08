-- Vroom database schema (MariaDB / MySQL compatible)
-- Run this after creating an empty database on your hosting provider.

CREATE TABLE customer (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  firstname     VARCHAR(50)  NOT NULL,
  lastname      VARCHAR(50)  NOT NULL,
  email         VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  address       VARCHAR(200),
  city          VARCHAR(50),
  state         VARCHAR(50),
  zip           VARCHAR(10),
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  admin         TINYINT(1)   DEFAULT 0
);

CREATE TABLE host (
  host_id       INT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  vehicle_type  VARCHAR(50),
  status        VARCHAR(20),
  num_vehicles  INT DEFAULT 0
);

CREATE TABLE renter (
  renter_id     INT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  vehicle_type  VARCHAR(50),
  status        VARCHAR(20)
);

CREATE TABLE vehiclecat (
  vehiclecat_id INT PRIMARY KEY,
  vehicle_make  VARCHAR(50)  NOT NULL,
  vehicle_model VARCHAR(50)  NOT NULL,
  vehicle_type  VARCHAR(50)
);

CREATE TABLE vehicle (
  vehicle_id    INT PRIMARY KEY,
  prodimage     VARCHAR(255),
  description   VARCHAR(500),
  duration      VARCHAR(50),
  vehicle_type  VARCHAR(50),
  daily_fee     DECIMAL(10,2) NOT NULL,
  status        VARCHAR(20),
  renter_id     INT,
  host_id       INT,
  review_id     INT,
  featured      TINYINT(1) DEFAULT 0,
  FOREIGN KEY (renter_id) REFERENCES renter(renter_id),
  FOREIGN KEY (host_id)   REFERENCES host(host_id)
);

CREATE TABLE saleorder (
  saleorder_id  INT AUTO_INCREMENT PRIMARY KEY,
  saledate      DATETIME NOT NULL,
  customer_id   INT NOT NULL,
  vehicle_id    INT NOT NULL,
  saleprice     DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (vehicle_id)  REFERENCES vehicle(vehicle_id)
);

CREATE TABLE promotion (
  promotion_id  INT PRIMARY KEY,
  promotitle    VARCHAR(100) NOT NULL,
  promoimage    VARCHAR(255),
  description   TEXT,
  startdate     DATE NOT NULL,
  enddate       DATE NOT NULL,
  discountrate  DECIMAL(5,2)
);
