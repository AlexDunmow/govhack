package grading

import (
	"fmt"
	"math/rand"

	"github.com/perthgophers/govhack/grading/accessibility"
	"github.com/perthgophers/govhack/grading/community"
	"github.com/perthgophers/govhack/grading/safety"
	"googlemaps.github.io/maps"
)

type GradingResult struct {
	Accessibility int `json:"accessibility"`
	Apocalypse    int `json:"apocalypse"`
	Community     int `json:"community"`
	Culture       int `json:"culture"`
	Safety        int `json:"safety"`
	Services      int `json:"services"`
}

//Cafe 1km
func Grade(addr []maps.GeocodingResult) GradingResult {
	longitude := addr[0].Geometry.Location.Lng
	latitude := addr[0].Geometry.Location.Lat
	safety.Hospitals(longitude, latitude)
	accessibiltyBusScore, _ := accessibility.Bus(longitude, latitude)
	communityLocationScore, _ := community.Location(longitude, latitude)
	communityServiceScore, _ := community.Service(longitude, latitude)
	accessibilityCongestionScore, _ := accessibility.Congestion(longitude, latitude)

	accessibiltyFinalScore := int((float64(accessibiltyBusScore) + float64(accessibilityCongestionScore)) / 2.0)
	communityFinalScore := int((float64(communityLocationScore) + float64(communityServiceScore)) / 2.0)
	fmt.Println("Accessibility Final Score:", accessibiltyFinalScore)
	fmt.Println("Community Final Score:", communityFinalScore)

	results := GradingResult{
		Accessibility: accessibiltyFinalScore,
		Apocalypse:    rand.Intn(7) + 3,
		Community:     communityFinalScore,
		Culture:       rand.Intn(7) + 3,
		Safety:        rand.Intn(7) + 3,
		Services:      rand.Intn(7) + 3,
	}
	return results
}
