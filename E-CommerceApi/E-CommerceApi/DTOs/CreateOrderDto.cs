using System.Text.Json.Serialization;

namespace E_CommerceApi.DTOs
{
    public class CreateOrderDto
    {
        [JsonPropertyName("shippingAddress")] 
        public string Address { get; set; }
        public string City { get; set; }
        public string PaymentMethod { get; set; } = "Cash";
        public string ReceiverPhoneNumber { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
}
