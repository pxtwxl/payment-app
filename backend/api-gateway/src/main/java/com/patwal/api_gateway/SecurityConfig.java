package com.patwal.api_gateway;

import io.netty.handler.codec.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable())
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(String.valueOf(HttpMethod.OPTIONS)).permitAll()
                        .pathMatchers("user-service/user/login", "user-service/user/register","user/register","user/login").permitAll()
                        .anyExchange().permitAll() // Allow all, let microservices handle auth
                );
        return http.build();
    }
}
