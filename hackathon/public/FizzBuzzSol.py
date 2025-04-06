import time
import argparse
from typing import List, Union, Optional


def generate_fizzbuzz(limit: int, 
                      fizz_mod: int = 3, 
                      fizz_remainder: int = 2,
                      buzz_mod: int = 5, 
                      buzz_remainder: int = 4,
                      delay: float = 0) -> List[Union[str, int]]:
    """
    Generate a list of FizzBuzz results based on custom parameters.
    
    Args:
        limit: The upper limit of numbers to process (exclusive)
        fizz_mod: The modulus to use for "fizz" condition
        fizz_remainder: The remainder that triggers "fizz"
        buzz_mod: The modulus to use for "buzz" condition
        buzz_remainder: The remainder that triggers "buzz"
        delay: Optional delay between calculations (for demonstration)
        
    Returns:
        A list containing the FizzBuzz sequence
    """
    results = []
    
    for i in range(limit):
        # Add optional delay for demonstration purposes
        if delay > 0:
            time.sleep(delay)
            
        # Calculate the FizzBuzz result
        fizz_condition = (i % fizz_mod == fizz_remainder)
        buzz_condition = (i % buzz_mod == buzz_remainder)
        
        if fizz_condition and buzz_condition:
            results.append("fizzbuzz")
        elif fizz_condition:
            results.append("fizz")
        elif buzz_condition:
            results.append("buzz")
        else:
            results.append(i + 1)
    
    return results


def print_results(results: List[Union[str, int]], 
                  columns: Optional[int] = None,
                  show_index: bool = False) -> None:
    """
    Print the FizzBuzz results in a formatted way.
    
    Args:
        results: The list of FizzBuzz results
        columns: Number of columns to print (None for single column)
        show_index: Whether to show the index with each result
    """
    if columns and columns > 0:
        # Print in multiple columns
        for i in range(0, len(results), columns):
            row = results[i:i+columns]
            if show_index:
                formatted_row = [f"{i+j}: {item}" for j, item in enumerate(row)]
            else:
                formatted_row = [f"{item}" for item in row]
            print("\t".join(formatted_row))
    else:
        # Print in a single column
        for i, result in enumerate(results):
            if show_index:
                print(f"{i}: {result}")
            else:
                print(result)


def analyze_results(results: List[Union[str, int]]) -> dict:
    """
    Analyze the FizzBuzz results and return statistics.
    
    Args:
        results: The list of FizzBuzz results
        
    Returns:
        A dictionary containing statistics about the results
    """
    stats = {
        "total": len(results),
        "fizz": results.count("fizz"),
        "buzz": results.count("buzz"),
        "fizzbuzz": results.count("fizzbuzz"),
        "numbers": len([x for x in results if isinstance(x, int)])
    }
    
    stats["fizz_percentage"] = (stats["fizz"] / stats["total"]) * 100
    stats["buzz_percentage"] = (stats["buzz"] / stats["total"]) * 100
    stats["fizzbuzz_percentage"] = (stats["fizzbuzz"] / stats["total"]) * 100
    stats["numbers_percentage"] = (stats["numbers"] / stats["total"]) * 100
    
    return stats


def display_stats(stats: dict) -> None:
    """
    Display the statistics from the FizzBuzz analysis.
    
    Args:
        stats: A dictionary containing the statistics
    """
    print("\n" + "=" * 30)
    print("FizzBuzz Analysis")
    print("=" * 30)
    print(f"Total items: {stats['total']}")
    print(f"Fizz count: {stats['fizz']} ({stats['fizz_percentage']:.2f}%)")
    print(f"Buzz count: {stats['buzz']} ({stats['buzz_percentage']:.2f}%)")
    print(f"FizzBuzz count: {stats['fizzbuzz']} ({stats['fizzbuzz_percentage']:.2f}%)")
    print(f"Numbers count: {stats['numbers']} ({stats['numbers_percentage']:.2f}%)")
    print("=" * 30)


def parse_arguments():
    """Parse command-line arguments for the FizzBuzz program."""
    parser = argparse.ArgumentParser(description='Enhanced FizzBuzz Program')
    parser.add_argument('--limit', type=int, default=100,
                        help='Upper limit of numbers to process (default: 100)')
    parser.add_argument('--fizz-mod', type=int, default=3,
                        help='Modulus to use for "fizz" condition (default: 3)')
    parser.add_argument('--fizz-remainder', type=int, default=2,
                        help='Remainder that triggers "fizz" (default: 2)')
    parser.add_argument('--buzz-mod', type=int, default=5,
                        help='Modulus to use for "buzz" condition (default: 5)')
    parser.add_argument('--buzz-remainder', type=int, default=4,
                        help='Remainder that triggers "buzz" (default: 4)')
    parser.add_argument('--columns', type=int, default=0,
                        help='Number of columns to display results (default: 0, single column)')
    parser.add_argument('--show-index', action='store_true',
                        help='Show index numbers with results')
    parser.add_argument('--delay', type=float, default=0,
                        help='Add delay between calculations in seconds (default: 0)')
    parser.add_argument('--stats', action='store_true',
                        help='Show statistics after generating results')
    return parser.parse_args()


def main():
    """Main function to run the FizzBuzz program."""
    # Parse command-line arguments
    args = parse_arguments()
    
    print(f"Generating FizzBuzz sequence up to {args.limit}...")
    
    # Generate the FizzBuzz sequence
    results = generate_fizzbuzz(
        limit=args.limit,
        fizz_mod=args.fizz_mod,
        fizz_remainder=args.fizz_remainder,
        buzz_mod=args.buzz_mod,
        buzz_remainder=args.buzz_remainder,
        delay=args.delay
    )
    
    # Print the results
    print_results(
        results=results,
        columns=args.columns,
        show_index=args.show_index
    )
    
    # Show statistics if requested
    if args.stats:
        stats = analyze_results(results)
        display_stats(stats)
    
    print("FizzBuzz sequence generation complete!")


if __name__ == "__main__":
    # If this script is run directly, execute the main function
    main()