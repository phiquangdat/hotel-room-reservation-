package com.team_seven.hotel_reservation_system.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.team_seven.hotel_reservation_system.models.Booking;
import com.team_seven.hotel_reservation_system.models.Customer;
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.models.RoomType;
import com.team_seven.hotel_reservation_system.dto.GuestBookingRequestDto;
import com.team_seven.hotel_reservation_system.repositories.BookingRepository;
import com.team_seven.hotel_reservation_system.repositories.CustomerRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomRepository;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Room testRoom;
    private GuestBookingRequestDto guestDto;
    private Customer newCustomer;
    private Customer existingCustomer;

    @BeforeEach
    void setUp() {
        RoomType mockRoomType = new RoomType();
        mockRoomType.setId(1L);
        mockRoomType.setPricePerNight(new BigDecimal("100.00"));

        testRoom = new Room();
        testRoom.setId(2L);
        testRoom.setRoomType(mockRoomType);

        guestDto = new GuestBookingRequestDto();
        guestDto.setRoomId(2L);
        guestDto.setEmail("test@example.com");
        guestDto.setCheckInDate(LocalDate.parse("2025-11-20"));
        guestDto.setCheckOutDate(LocalDate.parse("2025-11-25"));

        newCustomer = new Customer();
        newCustomer.setId(1L);
        newCustomer.setEmail("test@example.com");

        existingCustomer = new Customer();
        existingCustomer.setId(42L);
        existingCustomer.setEmail("existing@example.com");
    }

    @Test
    @DisplayName("Should create a new Customer AND a new Booking")
    void createBooking_NewCustomer_Success() {
        when(customerRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(newCustomer);
        when(roomRepository.findById(2L)).thenReturn(Optional.of(testRoom));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.createBooking(guestDto);

        assertThat(result.getTotalPrice()).isEqualByComparingTo(new BigDecimal("500.00"));
        assertThat(result.getCustomer().getId()).isEqualTo(1L);

        verify(customerRepository, times(1)).save(any(Customer.class));
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }
}
