# Esquema de Base de Datos

## Diagrama de Entidades

\`\`\`sql
-- Tabla de Productos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('palitos', 'tacitas', 'conos', 'tortas', 'postres', 'masas')),
    image VARCHAR(500),
    available BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT 0,
    has_flavors BOOLEAN DEFAULT false,
    available_flavors TEXT[], -- Array de sabores disponibles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Promociones
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    applicable_products UUID[], -- Array de IDs de productos
    min_order_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Órdenes
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- ORD-2024-001
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('efectivo', 'tarjeta', 'transferencia')),
    delivery_method VARCHAR(20) NOT NULL CHECK (delivery_method IN ('delivery', 'pickup')),
    total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    estimated_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Items de Orden
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL, -- Snapshot del nombre
    product_price DECIMAL(10,2) NOT NULL, -- Snapshot del precio
    quantity INTEGER NOT NULL,
    selected_flavors TEXT[], -- Sabores seleccionados
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Administradores
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Logs de Órdenes (para tracking)
CREATE TABLE order_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_promotions_active ON promotions(active);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\`\`\`

## Datos de Ejemplo

\`\`\`sql
-- Insertar admin por defecto
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2a$10$example_bcrypt_hash_here');

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, category, has_flavors, available_flavors, stock) VALUES
('Palito de Agua', 'Refrescante palito de agua con sabores naturales', 150.00, 'palitos', true, ARRAY['limón', 'naranja', 'frutilla', 'uva'], 100),
('Palito Bombón', 'Palito de helado cubierto con chocolate', 250.00, 'palitos', true, ARRAY['vainilla', 'dulce de leche', 'chocolate'], 80),
('Tacita Familiar', 'Tacita de helado de 1kg para compartir', 1200.00, 'tacitas', true, ARRAY['vainilla', 'chocolate', 'frutilla', 'dulce de leche'], 50),
('Cono Simple', 'Cono de helado con una bocha', 300.00, 'conos', true, ARRAY['vainilla', 'chocolate', 'frutilla', 'dulce de leche', 'menta granizada'], 200),
('Torta Helada Chica', 'Torta helada para 6 personas', 2500.00, 'tortas', false, NULL, 20),
('Tiramisu Helado', 'Postre helado estilo tiramisu', 450.00, 'postres', false, NULL, 30);

-- Insertar promoción de ejemplo
INSERT INTO promotions (title, description, discount_type, discount_value, start_date, end_date, featured) VALUES
('Combo Verano', '2x1 en palitos de agua todos los días', 'percentage', 50.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', true);
\`\`\`

## Relaciones

1. **customers** → **orders** (1:N)
2. **orders** → **order_items** (1:N)
3. **products** → **order_items** (1:N)
4. **orders** → **order_logs** (1:N)
5. **admins** → **order_logs** (1:N)

## Consideraciones de Performance

1. **Índices**: Creados en campos frecuentemente consultados
2. **Particionamiento**: Considerar particionar `orders` por fecha para grandes volúmenes
3. **Archivado**: Mover órdenes antiguas a tabla de archivo
4. **Cache**: Implementar cache Redis para productos y promociones
5. **Conexiones**: Pool de conexiones optimizado para Spring Boot

## Backup y Mantenimiento

1. **Backup diario** de toda la base de datos
2. **Backup incremental** cada 6 horas
3. **Retención**: 30 días para backups completos
4. **Monitoreo**: Alertas por espacio en disco y performance
5. **Limpieza**: Job automático para limpiar logs antiguos
