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

    public PasswordEncoder getEncoder() {
        return this.encoder;
    }
}
