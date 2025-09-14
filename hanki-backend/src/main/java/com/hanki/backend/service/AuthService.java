package com.hanki.backend.service;

import com.hanki.backend.dto.UserLoginDto;
import com.hanki.backend.dto.UserPostDto;
import com.hanki.backend.model.User;
import com.hanki.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JWTService jwtService;

    // TODO - Abstract out strength value to properties
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User registerUser(UserPostDto userPostDto) {
        User user = new User();
        user.setUsername(userPostDto.getUsername());
        user.setPassword(encoder.encode(userPostDto.getPassword()));
        user.setEmail(userPostDto.getEmail());

        return userRepository.save(user);
    }

    public boolean userExists(String username) {
        User userWithRequestedUsername = userRepository.findByUsername(username);

        return !Objects.equals(userWithRequestedUsername, null);
    }

    public boolean isUserVerified(UserLoginDto userLoginDto) throws AuthenticationException {
        Authentication authentication = null;

        try {
            authentication =
                    authManager.authenticate(new UsernamePasswordAuthenticationToken(userLoginDto.getUsername(), userLoginDto.getPassword()));
        } catch (AuthenticationException e) {
            return false;
        }

        return authentication.isAuthenticated();
    }

    public boolean validateRefreshToken(String refreshToken) {
        return jwtService.validateToken(refreshToken);
    }

    public Map<String, String> refreshAccessToken(String refreshToken) {
        String username = jwtService.extractUserName(refreshToken);

        return jwtService.generateAccessToken(username, refreshToken);
    }

    public User loginUser(UserLoginDto userLoginDto) {
        try {
            User user = userRepository.findByUsername(userLoginDto.getUsername());

            if (user == null) {
                // logger.info("User doesn't exist in database");
                return null;
            }

            if (encoder.matches(userLoginDto.getPassword(), user.getPassword())) {
                return user;
            } else {
                // logger.info("Invalid credentials.");
                return null;
            }
        } catch (IllegalArgumentException e) {
            // logger.err(e.getMessage());
            return null;
        }

    }

    public PasswordEncoder getEncoder() {
        return this.encoder;
    }
}
