package org.project.blog.system.config;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfiguration {
        private final UserDetailsService userDetailsService;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfiguration(UserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.userDetailsService = userDetailsService;
            this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
                return configuration.getAuthenticationManager();
        }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http){
        http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth-> auth
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()
                        .requestMatchers( "/api/users/search",
                                "/api/users/profile/**").permitAll()
                        .requestMatchers("/api/admin'**").hasRole("ADMIN")
                        .requestMatchers("/api/blogs/my").authenticated()
                        .requestMatchers(HttpMethod.GET,
                                "/api/blogs",
                                "/api/blogs/search",
                                "/api/blogs/user/**",
                                "/api/blogs/*",
                                "/api/blogs/*/comments",
                                "/api/blogs/*/likes",
                                "/api/blogs/*/likes/count").permitAll()
                        .requestMatchers("/api/blogs/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );
        return http.build();
    }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(java.util.List.of(
                                "http://localhost:5173",
                                "http://localhost:5174"
                ));
                configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type"));
                configuration.setAllowCredentials(false);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

}
