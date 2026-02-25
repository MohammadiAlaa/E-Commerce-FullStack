namespace E_CommerceApi.DTOs
{
    public class CartProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string ImageUrl { get; set; }

    }
}
