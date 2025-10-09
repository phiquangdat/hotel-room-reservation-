package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.UserRegisterRequest;
import com.team_seven.hotel_reservation_system.model.User;
import com.team_seven.hotel_reservation_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // (⚠️ Later: hash password!)

        userRepository.save(user);
        return "User registered successfully!";
    }
}