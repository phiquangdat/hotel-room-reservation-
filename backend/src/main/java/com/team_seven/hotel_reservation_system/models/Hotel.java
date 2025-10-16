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
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 20)
    private String phoneNumber;

    @Lob
    private String description;

    @Column(precision = 2, scale = 1)
    private BigDecimal rating;
}
