namespace E_CommerceApi.DTOs
{
    public class OrderResponseDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public ShippingResponseDto Shipping { get; set; }
        public List<OrderItemResponseDto> Items { get; set; }
        public PaymentResponseDto Payment { get; set; }
    }
}
