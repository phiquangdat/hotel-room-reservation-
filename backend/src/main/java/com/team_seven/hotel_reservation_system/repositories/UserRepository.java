package com.team_seven.hotel_reservation_system.repositories;

import com.team_seven.hotel_reservation_system.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
}
