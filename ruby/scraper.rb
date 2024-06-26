require "httparty"
require "nokogiri"
require "json"


response = HTTParty.get("http://127.0.0.1:5500/files/van-gogh-paintings.html")

document = Nokogiri::HTML(response.body)

artworks_array = []

# focus on the "a" tags that include the artwork data we need to scrape
html_data = document.css("#_c2yRXMvVOs3N-QazgILgAg93 > div > div > div.MiPcId.klitem-tr.mlo-c > a")

html_data.each do |entry|
	name = entry.at_css('div:nth-child(2) > div.kltat').text.strip.gsub("\n", "").squeeze(" ") # this solves the issue of the span causing extra spacing inside of the json file
	extensions_element = entry.at_css('div:nth-child(2) > div.ellip.klmeta')
	extensions = extensions_element ? [extensions_element.text.strip] : nil
	link = "https://www.google.com" + entry['href']
	image = entry.css('.rISBZc.M4dUYb').map { |img| img['src'] }.compact.join(", ")


	# conditionals so we don't have "extensions": null when the year element isn't found
	artwork_entry = if extensions
		{
			name: name,
			extensions: extensions,
			link: link,
			image: image.empty? ? nil : image
		}
	else
		{
			name: name,
			link: link,
			image: image.empty? ? nil : image
		}
	end

	artworks_array.push(artwork_entry)
end

# array of artwork data to proper JSON format
json_data = { artworks: artworks_array }

# artwork data to JSON file
File.open("vangogh-ruby-taariq-elliott.json", "w") { |file| file.write(JSON.pretty_generate(json_data)) }

puts "JSON file has been saved!"
