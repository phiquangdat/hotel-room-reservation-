package com.team_seven.hotel_reservation_system.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Entity
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "rating", precision = 3, scale = 1)
    private BigDecimal rating;
}
