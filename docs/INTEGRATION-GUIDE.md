# Guía de Integración Frontend-Backend

## Configuración del Frontend

### Variables de Entorno Requeridas

Crear archivo `.env.local` en el proyecto Next.js:

\`\`\`env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Admin Credentials (para desarrollo)
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
\`\`\`

### Configuración de API Client

El frontend está preparado para integrar con tu backend Java. Los endpoints actuales son mock y necesitan ser reemplazados:

**Archivos a modificar**:
1. `app/api/orders/route.ts` - Reemplazar con proxy al backend
2. Crear `lib/api-client.ts` - Cliente HTTP centralizado
3. Actualizar contextos para usar API real

### Ejemplo de Cliente API

\`\`\`typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin-token');
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Orders
  async createOrder(orderData: CreateOrderRequest) {
    return this.request<CreateOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId: string) {
    return this.request<GetOrderResponse>(`/orders/${orderId}`);
  }

  // Products
  async getProducts(params?: ProductsParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<GetProductsResponse>(`/products?${query}`);
  }

  // Admin Auth
  async adminLogin(credentials: LoginCredentials) {
    const response = await this.request<LoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success) {
      this.token = response.data.token;
      localStorage.setItem('admin-token', this.token);
    }
    
    return response;
  }
}

export const apiClient = new ApiClient();
\`\`\`

## Configuración del Backend Java

### Dependencias Maven Requeridas

\`\`\`xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
</dependencies>
\`\`\`

### Configuración CORS

\`\`\`java
@Configuration
@EnableWebSecurity
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
\`\`\`

### Estructura de Proyecto Sugerida

\`\`\`
src/main/java/com/heladeria/
├── HeladeriaApplication.java
├── config/
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── JwtConfig.java
├── controller/
│   ├── OrderController.java
│   ├── ProductController.java
│   ├── PromotionController.java
│   ├── AdminController.java
│   └── ReportController.java
├── service/
│   ├── OrderService.java
│   ├── ProductService.java
│   ├── PromotionService.java
│   ├── AdminService.java
│   └── ReportService.java
├── repository/
│   ├── OrderRepository.java
│   ├── ProductRepository.java
│   ├── PromotionRepository.java
│   └── AdminRepository.java
├── model/
│   ├── Order.java
│   ├── Product.java
│   ├── Promotion.java
│   ├── Customer.java
│   └── Admin.java
├── dto/
│   ├── request/
│   │   ├── CreateOrderRequest.java
│   │   ├── CreateProductRequest.java
│   │   └── LoginRequest.java
│   └── response/
│       ├── ApiResponse.java
│       ├── OrderResponse.java
│       └── ProductResponse.java
└── exception/
    ├── GlobalExceptionHandler.java
    └── CustomExceptions.java
\`\`\`

## Flujo de Integración

### 1. Desarrollo del Backend
1. Implementar modelos JPA según las especificaciones
2. Crear repositorios con Spring Data JPA
3. Implementar servicios con lógica de negocio
4. Crear controladores REST siguiendo la API spec
5. Configurar seguridad JWT para admin
6. Implementar manejo de errores global

### 2. Integración con Frontend
1. Reemplazar API routes mock con proxy al backend
2. Actualizar cliente API para usar endpoints reales
3. Configurar variables de entorno
4. Probar integración completa
5. Manejar estados de loading y error

### 3. Testing
1. Unit tests para servicios Java
2. Integration tests para controllers
3. End-to-end tests del flujo completo
4. Performance testing con carga

## Comandos de Desarrollo

### Backend (Java)
\`\`\`bash
# Ejecutar aplicación
./mvnw spring-boot:run

# Ejecutar tests
./mvnw test

# Generar JAR
./mvnw clean package
\`\`\`

### Frontend (Next.js)
\`\`\`bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar producción
npm start
\`\`\`

## Deployment

### Backend
- **Desarrollo**: Ejecutar localmente en puerto 8080
- **Producción**: Deploy en AWS/Heroku/Railway
- **Base de datos**: PostgreSQL en AWS RDS/Supabase

### Frontend
- **Desarrollo**: localhost:3000
- **Producción**: Vercel/Netlify
- **Variables de entorno**: Configurar API_URL de producción

## Monitoreo y Logs

### Backend
- Spring Boot Actuator para health checks
- Logback para logging estructurado
- Métricas con Micrometer

### Frontend
- Vercel Analytics para métricas
- Error tracking con Sentry (opcional)
- Performance monitoring
