package com.team_seven.hotel_reservation_system.repository;

import com.team_seven.hotel_reservation_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
}