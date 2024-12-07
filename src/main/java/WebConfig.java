import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.http.CacheControl;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from 'uploads' directory under static resources
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("classpath:/static/uploads/")  // Serve from classpath:/static/uploads/
                .setCachePeriod(0);  // Disable caching for images
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS for the specified origin (React app running on localhost:3000)
        registry.addMapping("/**")  // Apply to all endpoints
                .allowedOrigins("http://localhost:3000")  // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH","OPTION")  // Allowed HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow credentials (cookies, etc.)
    }
}
