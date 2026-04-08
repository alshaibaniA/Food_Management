-- Creating the 'items' table
CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255),
    category VARCHAR(255),
    image VARCHAR(255),
    price DOUBLE PRECISION NOT NULL,
    is_delete BOOLEAN NOT NULL,
    is_removed BOOLEAN NOT NULL
);

-- Creating the 'orders' table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    order_date TIMESTAMP,
    phone VARCHAR(255),
    status VARCHAR(255),
    comment VARCHAR(255),
    order_type VARCHAR(255)
);

-- Creating the 'order_items' table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    item_item_id BIGINT,
    order_order_id BIGINT,
    CONSTRAINT fk_order FOREIGN KEY (order_order_id)
        REFERENCES orders (order_id),
    CONSTRAINT fk_item FOREIGN KEY (item_item_id)
        REFERENCES items (item_id)
);

-- Creating the 'users' table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255),
    is_active BOOLEAN NOT NULL
);

-- Insert sample admin user
INSERT INTO users (username, password, role, is_active)
VALUES ('Admin', '$2y$10$PILt1aICec7yKDUZzsvM1OyZCc7nH6ZAq2hc30yGz9E9SVqE58G2W', 'ADMIN', true)
ON CONFLICT DO NOTHING;
