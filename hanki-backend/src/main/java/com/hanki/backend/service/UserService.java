package com.hanki.backend.service;

import com.hanki.backend.dto.UserPostDto;
import com.hanki.backend.model.User;
import com.hanki.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User registerUser(UserPostDto userPostDto) {
        User user = new User();
        user.setUsername(userPostDto.getUsername());
        user.setPassword(encoder.encode(userPostDto.getPassword()));
        user.setEmail(userPostDto.getEmail());

        // TODO - check for presence of combination of username & password

        return userRepository.save(user);
    }

    public User loginUser(UserPostDto userPostDto) {
        try {
            User user = userRepository.findByEmail(userPostDto.getEmail());

            if (user == null) {
                // logger.info("User doesn't exist in database");
                return null;
            }

            if (encoder.matches(userPostDto.getPassword(), user.getPassword())) {
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
