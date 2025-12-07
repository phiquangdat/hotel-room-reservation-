package com.team_seven.hotel_reservation_system.service.impl;

import com.team_seven.hotel_reservation_system.dto.GuestBookingRequestDto; 
import com.team_seven.hotel_reservation_system.models.Booking;
import com.team_seven.hotel_reservation_system.models.Customer;
import com.team_seven.hotel_reservation_system.models.Room;
import com.team_seven.hotel_reservation_system.repositories.BookingRepository;
import com.team_seven.hotel_reservation_system.repositories.CustomerRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomRepository;
import com.team_seven.hotel_reservation_system.repositories.RoomTypeRepository; 
import com.team_seven.hotel_reservation_system.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import java.util.Optional; 
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {
    
    private static final String ROOM_STATUS_AVAILABLE = "AVAILABLE";
    private static final String ROOM_STATUS_BOOKED = "BOOKED";
    private static final String ROOM_STATUS_OCCUPIED = "OCCUPIED";
    
    private static final String BOOKING_STATUS_CHECKED_IN = "CHECKED_IN";
    private static final String BOOKING_STATUS_CHECKED_OUT = "CHECKED_OUT";
    private static final String BOOKING_STATUS_CANCELLED = "CANCELLED";


    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private RoomTypeRepository roomTypeRepository; 
    
    @Override
    @Transactional 
    public Booking createBooking(GuestBookingRequestDto dto) { 
        long numberOfNights = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        if (numberOfNights <= 0) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
        
        Room room = roomRepository.findById(dto.getRoomId()) 
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + dto.getRoomId()));

        Optional<Customer> existingCustomer = customerRepository.findByEmail(dto.getEmail());
        
        Customer customerToUse;
        if (existingCustomer.isPresent()) {
            customerToUse = existingCustomer.get();
        } else {
            Customer newCustomer = new Customer();
            newCustomer.setEmail(dto.getEmail());
            newCustomer.setFirstName(dto.getFirstName());
            newCustomer.setLastName(dto.getLastName());
            newCustomer.setPhoneNumber(dto.getPhoneNumber());
            customerToUse = customerRepository.save(newCustomer);
        }

        BigDecimal pricePerNight = room.getRoomType().getPricePerNight(); 
        BigDecimal totalPrice = pricePerNight.multiply(BigDecimal.valueOf(numberOfNights));

        Booking newBooking = new Booking();
        newBooking.setCustomer(customerToUse); 
        newBooking.setRoom(room);
        newBooking.setCheckInDate(dto.getCheckInDate());
        newBooking.setCheckOutDate(dto.getCheckOutDate());
        newBooking.setNumberOfGuests(dto.getNumberOfGuests());
        
        newBooking.setStatus("CONFIRMED"); 
        
        newBooking.setTotalPrice(totalPrice);

        Booking savedBooking = bookingRepository.save(newBooking);
        
        if (room.getStatus().equalsIgnoreCase(ROOM_STATUS_AVAILABLE)) {
            room.setStatus(ROOM_STATUS_BOOKED); 
            roomRepository.save(room);
        }
        
        return savedBooking;
    }

    @Override
    public Page<Booking> getBookings(String statusFilter, Pageable pageable) {
        if (statusFilter == null || statusFilter.isEmpty()) {
            return bookingRepository.findAll(pageable);
        }
        return bookingRepository.findAllByStatusContainingIgnoreCase(statusFilter, pageable);
    }

    @Override
    @Transactional
    public List<Booking> getBookingsByCurrentUser(String userEmail) {
        
        List<Booking> bookings = bookingRepository.findDetailedBookingsByCustomerEmail(userEmail);

        return bookings; 
    }

    @Override
    @Transactional
    public Booking updateStatus(Long id, String status) { 
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        Room room = booking.getRoom();
        
        booking.setStatus(status.toUpperCase());
        Booking updatedBooking = bookingRepository.save(booking);

        if (status.equalsIgnoreCase(BOOKING_STATUS_CHECKED_IN)) {
            room.setStatus(ROOM_STATUS_OCCUPIED);
            roomRepository.save(room);
        } else if (status.equalsIgnoreCase(BOOKING_STATUS_CHECKED_OUT) || status.equalsIgnoreCase(BOOKING_STATUS_CANCELLED)) {
            room.setStatus(ROOM_STATUS_AVAILABLE); 
            roomRepository.save(room);
        }
        
        return updatedBooking;
    }
}