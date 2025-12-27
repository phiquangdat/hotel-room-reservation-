-- Mock Data for Hotel Reservation System
-- Usage: Run this script against your PostgreSQL database to populate it with sample data.

-- 0. Create Schema (Tables)

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    phone_number VARCHAR(20),
    description TEXT,
    rating NUMERIC(3, 1)
);

CREATE TABLE IF NOT EXISTS room_types (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES hotels(id),
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    description TEXT,
    price_per_night NUMERIC(10, 2) NOT NULL,
    capacity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_type_id INTEGER NOT NULL REFERENCES room_types(id),
    room_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS customer_roles (
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    PRIMARY KEY (customer_id, role_id)
);

CREATE TABLE IF NOT EXISTS bookings (
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

-- 1. Insert Roles (if not already present via DataInitializer)
INSERT INTO roles (name) VALUES 
('ROLE_USER'),
('ROLE_ADMIN')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Hotels
INSERT INTO hotels (name, address, city, phone_number, description, rating) VALUES
('Grand Budapest Hotel', '123 Mountain View Rd', 'Zubrowka', '+1234567890', 'A famous european ski resort hotel.', 4.9),
('The Plaza', '768 5th Ave', 'New York', '+1987654321', 'Luxury hotel in Midtown Manhattan.', 4.7);

-- 3. Insert Room Types
-- Assuming IDs 1 and 2 for hotels based on insertion order
INSERT INTO room_types (hotel_id, name, image_url, description, price_per_night, capacity) VALUES
(1, 'Single Room', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80', 'Cozy single room for solo travelers.', 100.00, 1),
(1, 'Double Room', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80', 'Spacious room with a double bed.', 150.00, 2),
(1, 'Suite', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80', 'Luxury suite with panoramic view.', 300.00, 4),
(2, 'King Suite', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80', 'Royal experience with a king-sized bed.', 500.00, 2);

-- 4. Insert Rooms
-- Linking to Room Types (Assuming IDs 1-4)
INSERT INTO rooms (room_type_id, room_number, status) VALUES
(1, '101', 'AVAILABLE'),
(1, '102', 'BOOKED'),
(2, '201', 'AVAILABLE'),
(2, '202', 'AVAILABLE'),
(3, '301', 'AVAILABLE'),
(4, '401', 'MAINTENANCE');

-- 5. Insert Customers
-- Password is 'password' hashed with bcrypt (example hash)
INSERT INTO customers (email, first_name, last_name, phone_number, password) VALUES
('john.doe@example.com', 'John', 'Doe', '555-0101', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQiy38S'), 
('jane.admin@example.com', 'Jane', 'Admin', '555-0102', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQiy38S');

-- 6. Insert Customer Roles
-- Assuming Role IDs: 1=ROLE_USER, 2=ROLE_ADMIN (Adjust based on actual IDs in DB)
-- Assuming Customer IDs: 1=John, 2=Jane
INSERT INTO customer_roles (customer_id, role_id) VALUES
(1, (SELECT id FROM roles WHERE name = 'ROLE_USER')),
(2, (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')),
(2, (SELECT id FROM roles WHERE name = 'ROLE_USER'));

-- 7. Insert Bookings
INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, number_of_guests, total_price, status, created_at) VALUES
(1, 2, '2023-12-01', '2023-12-05', 1, 400.00, 'COMPLETED', NOW()),
(1, 3, '2024-06-10', '2024-06-15', 2, 750.00, 'CONFIRMED', NOW());
