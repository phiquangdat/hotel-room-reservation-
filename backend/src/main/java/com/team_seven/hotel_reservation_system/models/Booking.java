package com.team_seven.hotel_reservation_system.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false) 
    @ToString.Exclude 
    @EqualsAndHashCode.Exclude 
    private Customer customer;

    @JsonBackReference(value = "room-booking")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Room room;

    @Column(name = "check_in_date")
    private LocalDate checkInDate;

    @Column(name = "check_out_date")
    private LocalDate checkOutDate;

    @Column(name = "number_of_guests")
    private int numberOfGuests;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    private String status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private java.sql.Timestamp createdAt;
}
