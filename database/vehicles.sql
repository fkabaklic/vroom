-- Replace vehicle catalog with entries matching public/images car photos.
-- Safe to re-run: clears dependent sale orders first.

DELETE FROM saleorder;
DELETE FROM vehicle;
DELETE FROM vehiclecat;

UPDATE host SET vehicle_type = 'Electric', num_vehicles = 3 WHERE host_id = 1;
UPDATE host SET vehicle_type = 'Luxury', num_vehicles = 2 WHERE host_id = 2;
UPDATE renter SET vehicle_type = 'Electric' WHERE renter_id = 1;
UPDATE renter SET vehicle_type = 'Sports Car' WHERE renter_id = 2;

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
