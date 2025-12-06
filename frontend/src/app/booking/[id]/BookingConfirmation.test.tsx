import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingConfirmation from "./BookingConfirmation";
import { useSearchStore } from "@/lib/store";

import { createBooking, type BookingRoomProps } from "@/lib/actions";
import toast from "react-hot-toast";

jest.mock("@/lib/store", () => ({
  useSearchStore: jest.fn(),
}));

jest.mock("@/lib/actions", () => ({
  ...jest.requireActual("@/lib/actions"),
  createBooking: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  calculateNights: jest.fn((checkIn: string, checkOut: string) => {
    if (checkIn === "2025-11-20" && checkOut === "2025-11-25") return 5;
    return 0;
  }),
  formatDate: jest.fn((dateString?: string) => {
    if (dateString === "2025-11-20") return "November 20, 2025";
    if (dateString === "2025-11-25") return "November 25, 2025";
    return "N/A";
  }),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  Toaster: () => React.createElement("div", { "data-testid": "toaster" }),
  default: { success: jest.fn(), error: jest.fn() },
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedCreateBooking = createBooking as jest.Mock;
const mockedToastSuccess = toast.success as jest.Mock;

const mockRoom: BookingRoomProps = {
  roomId: 10,
  roomNumber: "101",
  roomTypeId: "1",
  roomTypeName: "Deluxe Suite",
  imageUrl: "/test-image.jpg",
  pricePerNight: 250.0,
  status: "Available",
  capacity: 2,
  hotelName: "The Grand Hotel",
};

const validStoreState = {
  checkInDate: "2025-11-20",
  checkOutDate: "2025-11-25",
  guestCapacity: 2,
};

describe("BookingConfirmation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchStore as unknown as jest.Mock).mockReturnValue(validStoreState);
  });

  test("renders summary and guest form when details are present", () => {
    render(<BookingConfirmation {...mockRoom} />);

    expect(screen.getByText("Booking Summary")).toBeInTheDocument();
    expect(screen.getByText("Guest Details")).toBeInTheDocument();
    expect(screen.getByText("November 20, 2025")).toBeInTheDocument();
    expect(screen.getByText("November 25, 2025")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("$1250.00")).toBeInTheDocument();
  });

  test("submits form, calls server action, and shows success message", async () => {
    const user = userEvent.setup();
    mockedCreateBooking.mockResolvedValue({
      id: 123,
      status: "CONFIRMED",
    });

    render(<BookingConfirmation {...mockRoom} />);

    await user.type(screen.getByLabelText("First Name"), "Test");
    await user.type(screen.getByLabelText("Last Name"), "User");
    await user.type(screen.getByLabelText("Email"), "test@user.com");
    await user.type(screen.getByLabelText("Phone Number"), "123456789");

    const submitButton = screen.getByRole("button", { name: /Confirm & Pay/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedCreateBooking).toHaveBeenCalledTimes(1);
      expect(mockedCreateBooking).toHaveBeenCalledWith({
        firstName: "Test",
        lastName: "User",
        email: "test@user.com",
        phoneNumber: "123456789",
        roomId: mockRoom.roomId,
        checkInDate: new Date(validStoreState.checkInDate).toISOString(),
        checkOutDate: new Date(validStoreState.checkOutDate).toISOString(),
        numberOfGuests: validStoreState.guestCapacity,
      });
    });

    await waitFor(() => {
      expect(mockedToastSuccess).toHaveBeenCalledWith(
        "Booking confirmed successfully!"
      );
    });
  });

  test("shows server error message if createBooking fails", async () => {
    const user = userEvent.setup();
    mockedCreateBooking.mockResolvedValue({
      error: "This room is not available for the selected dates.",
    });

    render(<BookingConfirmation {...mockRoom} />);

    await user.type(screen.getByLabelText("First Name"), "Test");
    await user.type(screen.getByLabelText("Last Name"), "User");
    await user.type(screen.getByLabelText("Email"), "test@user.com");
    await user.type(screen.getByLabelText("Phone Number"), "123456789");
    await user.click(screen.getByRole("button", { name: /Confirm & Pay/i }));

    await waitFor(() => {
      expect(
        screen.getByText("This room is not available for the selected dates.")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Confirm & Pay/i })
    ).not.toBeDisabled();
  });
});
