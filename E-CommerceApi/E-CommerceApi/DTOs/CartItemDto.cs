namespace E_CommerceApi.DTOs
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public int Quantity { get; set; }
        public CartProductDto Item { get; set; }
    }
}
