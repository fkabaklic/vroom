-- Sample data for local development and demos.
-- Admin login: username=admin  password=admin123

INSERT INTO customer (customer_id, firstname, lastname, email, phone, address, city, state, zip, username, password, admin) VALUES
(1, 'Admin', 'User', 'admin@vroom.com', '312-555-0100', '1 E Jackson Blvd', 'Chicago', 'IL', '60604', 'admin', '$2a$10$6Mibtl0Ltyi9Dbx22j1rBeS/4u7WV.2GAwpt8lbsPYFVDcILu42hG', 1),
(2, 'Jane', 'Renter', 'jane@vroom.com', '312-555-0101', '123 Main St', 'Chicago', 'IL', '60601', 'jane', '$2a$10$6Mibtl0Ltyi9Dbx22j1rBeS/4u7WV.2GAwpt8lbsPYFVDcILu42hG', 0);

INSERT INTO host (host_id, name, vehicle_type, status, num_vehicles) VALUES
(1, 'City Hosts LLC', 'Electric', 'Active', 3),
(2, 'Lakefront Rentals', 'Luxury', 'Active', 2);

INSERT INTO renter (renter_id, name, vehicle_type, status) VALUES
(1, 'Jane Renter', 'Electric', 'Active'),
(2, 'Sam Driver', 'Sports Car', 'Active');

INSERT INTO vehiclecat (vehiclecat_id, vehicle_make, vehicle_model, vehicle_type) VALUES
(1, 'BMW', '3 Series', 'Luxury'),
(2, 'Ford', 'Mustang GT', 'Sports Car'),
(3, 'Tesla', 'Model Y', 'Electric'),
(4, 'Tesla', 'Model 3', 'Electric'),
(5, 'Mercedes-Benz', 'CLA', 'Luxury');

INSERT INTO vehicle (vehicle_id, prodimage, description, duration, vehicle_type, daily_fee, status, renter_id, host_id, review_id, featured) VALUES
(1, 'bmw_series3.jpg', 'BMW 3 Series M Sport Sedan', '3 days', 'Luxury', 89.00, 'Available', 1, 1, NULL, 1),
(2, 'mustang.jpg', 'Ford Mustang GT Coupe', '2 days', 'Sports Car', 120.00, 'Available', 2, 2, NULL, 1),
(3, 'tesla_model_y.jpg', 'Tesla Model Y Long Range', '4 days', 'Electric', 95.00, 'Available', 1, 1, NULL, 1),
(4, 'model_3.jpg', 'Tesla Model 3 Standard Range', '3 days', 'Electric', 85.00, 'Available', 1, 1, NULL, 1),
(5, 'mercedes_cla.jpg', 'Mercedes-Benz CLA Coupe', '3 days', 'Luxury', 99.00, 'Available', 2, 2, NULL, 1);

INSERT INTO promotion (promotion_id, promotitle, promoimage, description, startdate, enddate, discountrate) VALUES
(1, 'Summer Sale', 'summer.jpg', '10% off weekend rentals', '2026-06-01', '2026-08-31', 10.00);
