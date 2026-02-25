namespace E_CommerceApi.DTOs
{
    public class ShippingFullDetailsDto
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string ReceiverPhoneNumber { get; set; }
        public string Status { get; set; }
        public string? CancelReason { get; set; }
        public int OrderId { get; set; }
        public string? DriverId { get; set; }
        public string? DriverName { get; set; }

    }
}
