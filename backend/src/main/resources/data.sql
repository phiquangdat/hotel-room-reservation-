-- Mock Data for Hotel Reservation System
-- Usage: Automatically loaded by Spring Boot on startup. Checked for correctness.
-- WARNING: This script DROPS all existing tables to ensure a clean state for mock data.

-- ==================================================================================
-- 0. CLEANUP (Handle persistent volume pollution)
-- ==================================================================================
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customer_roles CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ==================================================================================
-- 1. SCHEMA DEFINITION
-- ==================================================================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    phone_number VARCHAR(20),
    description TEXT,
    rating NUMERIC(3, 1),
    image_url VARCHAR(255)
);

CREATE TABLE room_types (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES hotels(id),
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    description TEXT,
    price_per_night NUMERIC(10, 2) NOT NULL,
    capacity INTEGER NOT NULL
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_type_id INTEGER NOT NULL REFERENCES room_types(id),
    room_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE customer_roles (
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    PRIMARY KEY (customer_id, role_id)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    check_in_date DATE,
    check_out_date DATE,
    number_of_guests INTEGER,
    total_price NUMERIC(10, 2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================================
-- 2. DATA INSERTION (With Explicit IDs for Consistency)
-- ==================================================================================

-- Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN'),
(3, 'ROLE_RECEPTIONIST');
-- Reset sequence to avoid conflicts if new rows are added manually later
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));

-- Hotels
INSERT INTO hotels (id, name, address, city, phone_number, description, rating, image_url) VALUES
(1, 'Grand Budapest Hotel', '123 Mountain View Rd', 'Zubrowka', '+1234567890', 'A famous european ski resort hotel known for its concierge.', 4.9, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80'),
(2, 'The Plaza', '768 5th Ave', 'New York', '+1987654321', 'Luxury hotel in Midtown Manhattan with iconic views.', 4.7, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'),
(3, 'Ritz Paris', '15 Place Vendôme', 'Paris', '+33143163030', 'Historic luxury hotel in the heart of Paris.', 4.8, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80'),
(4, 'Burj Al Arab', 'Jumeirah St', 'Dubai', '+97143017777', 'The world''s only 7-star hotel.', 5.0, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80'),
(5, 'Hotel California', '42 Desert Hwy', 'Los Angeles', '+15551234567', 'Such a lovely place, such a lovely face.', 4.5, 'https://images.unsplash.com/photo-1571896349842-68c47eb1d803?auto=format&fit=crop&q=80'),
(6, 'Nordic Light Hotel', 'Hovioikeudenpuistikko 18', 'Vaasa', '+358501234567', 'Modern hotel in the heart of Vaasa, perfect for business and leisure.', 4.6, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80'),
(7, 'Hotel Kämp', 'Pohjoisesplanadi 29', 'Helsinki', '+3589576111', 'The grand dame of Finnish hotels, established in 1887.', 4.8, 'https://images.unsplash.com/photo-1568495248636-6432b91f89e5?auto=format&fit=crop&q=80'),
(8, 'Clarion Hotel Helsinki', 'Tyynenmerenkatu 2', 'Helsinki', '+358108503820', 'Modern skyscrapers offering stunning views of the Baltic Sea.', 4.4, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80'),
(9, 'Arctic TreeHouse Hotel', 'Tarvantie 3', 'Rovaniemi', '+358505176909', 'Experience the Northern Lights from your bed in these luxury nests.', 4.9, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80'),
(10, 'Park Hyatt Tokyo', '3-7-1-2 Nishi-Shinjuku', 'Tokyo', '+81353221234', 'Luxury high-rise hotel featured in Lost in Translation.', 4.9, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80'),
(11, 'Scandic Vaasa', 'Rosteninkatu 6', 'Vaasa', '+35863535353', 'Comfortable stay in the center of Vaasa.', 4.3, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80');
SELECT setval('hotels_id_seq', (SELECT MAX(id) FROM hotels));

-- Room Types
INSERT INTO room_types (id, hotel_id, name, image_url, description, price_per_night, capacity) VALUES
(1, 1, 'Single Room', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80', 'Cozy single room.', 100.00, 1),
(2, 1, 'Double Room', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80', 'Spacious double room.', 150.00, 2),
(3, 1, 'Grand Suite', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80', 'Luxury suite.', 300.00, 4),
(4, 2, 'King Suite', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80', 'Royal experience.', 500.00, 2),
(5, 2, 'City View Room', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80', 'Room with a view.', 350.00, 2),
(6, 3, 'Executive Suite', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80', 'Elegant suite.', 750.00, 2),
(7, 4, 'Royal Penthouse', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80', 'Ultimate luxury.', 2500.00, 6),
(8, 5, 'Standard Room', 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&q=80', 'Classic room.', 120.00, 2),
(9, 6, 'Standard Single', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80', 'Modern single room.', 95.00, 1),
(10, 6, 'Standard Double', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80', 'Comfortable double room.', 130.00, 2),
(11, 6, 'Sauna Suite', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80', 'Suite with private sauna.', 220.00, 3),
(12, 7, 'Deluxe King', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80', 'Historic luxury room.', 400.00, 2),
(13, 7, 'Mannerheim Suite', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80', 'The most prestigious suite.', 1500.00, 4),
(14, 8, 'Superior View', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80', 'High floor with sea view.', 180.00, 2),
(15, 9, 'TreeHouse Suite', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80', 'Panoramic view suite.', 600.00, 2),
(16, 10, 'Park View Room', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80', 'Stunning Tokyo views.', 800.00, 2),
(17, 6, 'Superior Twin', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80', 'Two single beds with city view.', 140.00, 2),
(18, 6, 'Family Suite', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80', 'Spacious suite for families.', 250.00, 4),
(19, 11, 'Standard Queen', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80', 'Cozy queen bed.', 110.00, 2), -- Scandic
(20, 11, 'Superior King', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80', 'Spacious king room.', 145.00, 2), -- Scandic
(21, 6, 'Economy Twin', 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&q=80', 'Budget friendly twin room.', 90.00, 2); -- Nordic Economy
SELECT setval('room_types_id_seq', (SELECT MAX(id) FROM room_types));

-- Rooms
INSERT INTO rooms (id, room_type_id, room_number, status) VALUES
(1, 1, '101', 'AVAILABLE'), (2, 1, '102', 'BOOKED'),
(3, 2, '201', 'AVAILABLE'), (4, 2, '202', 'AVAILABLE'),
(5, 3, '301', 'AVAILABLE'),
(6, 4, 'P100', 'BOOKED'), (7, 4, 'P101', 'AVAILABLE'),
(8, 5, 'P200', 'AVAILABLE'),
(9, 6, 'R404', 'AVAILABLE'),
(10, 7, 'B777', 'AVAILABLE'),
(11, 8, 'C55', 'AVAILABLE'),
(12, 9, 'V101', 'AVAILABLE'),
(13, 10, 'V201', 'AVAILABLE'), (14, 10, 'V202', 'AVAILABLE'),
(24, 10, 'V203', 'AVAILABLE'), (25, 10, 'V204', 'AVAILABLE'), (26, 10, 'V205', 'AVAILABLE'), -- More Doubles
(15, 11, 'V301', 'BOOKED'), (27, 11, 'V302', 'AVAILABLE'), -- More Suites
(16, 12, 'K401', 'AVAILABLE'), (17, 12, 'K402', 'BOOKED'),
(18, 13, 'K500', 'AVAILABLE'),
(19, 14, 'C808', 'AVAILABLE'), (20, 14, 'C809', 'AVAILABLE'),
(21, 15, 'T01', 'BOOKED'), (22, 15, 'T02', 'AVAILABLE'),
(23, 16, 'PH5201', 'AVAILABLE'),
(28, 17, 'V401', 'AVAILABLE'), (29, 17, 'V402', 'AVAILABLE'), (30, 17, 'V403', 'AVAILABLE'), -- Superior Twins
(31, 18, 'V501', 'AVAILABLE'), (32, 18, 'V502', 'AVAILABLE'), -- Family Suites
(33, 19, 'S101', 'AVAILABLE'), (34, 19, 'S102', 'AVAILABLE'), -- Scandic Standard
(35, 20, 'S201', 'AVAILABLE'), (36, 20, 'S202', 'AVAILABLE'), -- Scandic Superior
(37, 21, 'V001', 'AVAILABLE'), (38, 21, 'V002', 'AVAILABLE'); -- Nordic Economy
SELECT setval('rooms_id_seq', (SELECT MAX(id) FROM rooms));

-- Customers (Password for all accounts is 'password')
INSERT INTO customers (id, email, first_name, last_name, phone_number, password) VALUES
(1, 'john.doe@example.com', 'John', 'Doe', '555-0101', '$2a$10$SlijsU63rPm..dZr9JiFd.ommGrXLFLpNXntusBtG0.aaUtZrKWa.'), 
(2, 'jane.admin@example.com', 'Jane', 'Admin', '555-0102', '$2a$10$SlijsU63rPm..dZr9JiFd.ommGrXLFLpNXntusBtG0.aaUtZrKWa.'),
(3, 'jane.receptionist@example.com', 'Jane', 'Receptionist', '555-0103', '$2a$10$SlijsU63rPm..dZr9JiFd.ommGrXLFLpNXntusBtG0.aaUtZrKWa.'),
(4, 'alice.wonder@example.com', 'Alice', 'Wonder', '555-0104', '$2a$10$SlijsU63rPm..dZr9JiFd.ommGrXLFLpNXntusBtG0.aaUtZrKWa.'),
(5, 'bob.traveler@example.com', 'Bob', 'Traveler', '555-0105', '$2a$10$SlijsU63rPm..dZr9JiFd.ommGrXLFLpNXntusBtG0.aaUtZrKWa.');
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));

-- Customer Roles (Linking with explicit IDs)
INSERT INTO customer_roles (customer_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 1);

-- Bookings
INSERT INTO bookings (id, customer_id, room_id, check_in_date, check_out_date, number_of_guests, total_price, status, created_at) VALUES
(1, 1, 2, '2023-12-01', '2023-12-05', 1, 400.00, 'COMPLETED', NOW()),
(2, 1, 3, '2025-06-10', '2025-06-15', 2, 750.00, 'CONFIRMED', NOW()),
(3, 4, 19, '2025-07-01', '2025-07-05', 2, 2500.00, 'CONFIRMED', NOW()), -- Room 19 (C808) for Clarions
(4, 5, 12, '2026-02-01', '2026-02-03', 1, 260.00, 'CONFIRMED', NOW()), -- Room 12 (V101) for Nordic
(5, 4, 8, '2025-08-20', '2025-08-25', 1, 600.00, 'PENDING', NOW()), -- Room 8 (P200)
(6, 1, 1, '2023-11-01', '2023-11-03', 1, 200.00, 'CANCELLED', NOW());
SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));
