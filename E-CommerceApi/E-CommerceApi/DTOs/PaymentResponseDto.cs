namespace E_CommerceApi.DTOs
{
    public class PaymentResponseDto
    {
        public string Method { get; set; }
        public string Status { get; set; }
        public decimal Amount { get; set; }
    }
}
