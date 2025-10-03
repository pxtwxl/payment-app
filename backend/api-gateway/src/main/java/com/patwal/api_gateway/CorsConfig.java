package com.patwal.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
           CorsConfiguration corsConfig = new CorsConfiguration();
           corsConfig.addAllowedOriginPattern("*"); // Allow all origins
           corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
           corsConfig.setAllowedHeaders(Arrays.asList("*"));
           corsConfig.setAllowCredentials(true); // Disable credentials for full open CORS

           UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
           source.registerCorsConfiguration("/**", corsConfig);

           return new CorsWebFilter(source);
    }
}
