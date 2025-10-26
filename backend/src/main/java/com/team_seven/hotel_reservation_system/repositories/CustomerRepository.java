package com.team_seven.hotel_reservation_system.repositories;

import com.team_seven.hotel_reservation_system.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByEmail(String email);
}
