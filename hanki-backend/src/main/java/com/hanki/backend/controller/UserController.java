package com.hanki.backend.controller;

import com.hanki.backend.dto.UserLoginDto;
import com.hanki.backend.dto.UserPostDto;
import com.hanki.backend.dto.UserResponseDto;
import com.hanki.backend.model.User;
import com.hanki.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody UserPostDto userPostDto) {
        User user = userService.registerUser(userPostDto);

        UserResponseDto userResponseDto = new UserResponseDto(user.getId(), user.getUsername(), user.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDto userLoginDto) {
        String accessToken = userService.verify(userLoginDto);

        if ("Fail".equals(accessToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        Map<String, String> responseBody = Map.of(
                "access_token", accessToken
        );

        return ResponseEntity.ok(responseBody);
    }
}
