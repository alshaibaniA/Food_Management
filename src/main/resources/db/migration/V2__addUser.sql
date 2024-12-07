
-- Insert sample users into the users table

INSERT INTO public.users (username, password, role, is_active)
VALUES
    ('Admin', '$2y$10$PILt1aICec7yKDUZzsvM1OyZCc7nH6ZAq2hc30yGz9E9SVqE58G2W', 'ADMIN', true);

-- Optionally, you could also add more users based on your needs
