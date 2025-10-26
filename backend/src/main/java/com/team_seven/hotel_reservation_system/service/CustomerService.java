package com.team_seven.hotel_reservation_system.service;

import com.team_seven.hotel_reservation_system.dto.UserRegisterRequest;  
import com.team_seven.hotel_reservation_system.models.Customer;
import com.team_seven.hotel_reservation_system.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public String registerUser(UserRegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        Customer customer = new Customer();

        customer.setEmail(request.getEmail());
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhoneNumber(request.getPhoneNumber());

        customerRepository.save(customer);
        return "Customer registered successfully!";
    }
}

