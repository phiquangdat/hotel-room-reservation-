package com.team_seven.hotel_reservation_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeDto {
    private Long id;
    private String name;
    private String imageUrl;
    private String description;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private Long hotelId;
    private String hotelName;
}
