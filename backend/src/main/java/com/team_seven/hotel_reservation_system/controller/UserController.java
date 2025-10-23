package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.UserRegisterRequest;
import com.team_seven.hotel_reservation_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegisterRequest request) {
        String result = userService.registerUser(request);
        return ResponseEntity.ok(result);
    }
}