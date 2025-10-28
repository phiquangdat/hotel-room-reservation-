package com.team_seven.hotel_reservation_system.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDto {
    private Long id;
    private String roomNumber;
    private Long roomTypeId;      
    private String roomTypeName;    
    private String imageUrl;
    private BigDecimal pricePerNight;
    private String status;
    private Integer capacity;
    private String hotelName;
}
