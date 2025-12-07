package com.team_seven.hotel_reservation_system.controller;

import com.team_seven.hotel_reservation_system.dto.AuthResponse;
import com.team_seven.hotel_reservation_system.dto.LoginRequest;
import com.team_seven.hotel_reservation_system.models.Customer;
import com.team_seven.hotel_reservation_system.models.Role;
import com.team_seven.hotel_reservation_system.repositories.CustomerRepository;
import com.team_seven.hotel_reservation_system.repositories.RoleRepository;
import com.team_seven.hotel_reservation_system.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Collections;
import java.util.HashSet;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtils.generateToken(userDetails);
        
        Customer customer = customerRepository.findByEmail(request.getEmail()).orElseThrow();

        String userRole = customer.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN")) ? "ROLE_ADMIN" : "ROLE_USER";

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .email(customer.getEmail())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .phoneNumber(customer.getPhoneNumber())
                .role(userRole)
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Customer customer) {
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already in use"));
        }
        
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role 'ROLE_USER' is not found."));
                
        customer.setRoles(new HashSet<>(Collections.singletonList(userRole)));
        customerRepository.save(customer);
        
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }
}
