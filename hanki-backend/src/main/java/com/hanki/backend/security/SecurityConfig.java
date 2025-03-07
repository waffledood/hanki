package com.hanki.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {


        http
                // no auth required on the /cards endpoint
                .authorizeHttpRequests(request -> request.requestMatchers("cards").permitAll())
                // all other endpoints require auth
                .authorizeHttpRequests(request -> request.anyRequest().authenticated())
                // to allow requests via browser
                .formLogin(Customizer.withDefaults())
                // to allow API/HTTP requests
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
