import { View, Text, ActivityIndicator, FlatList, Dimensions, Image, StyleSheet } from 'react-native';
import {interpolate, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue} from 'react-native-reanimated'
import Animated from 'react-native-reanimated'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apikey } from '@/lib/queryClient'

type SearchPayload = {
    total_results: number
    page: number,
    per_page: string,
    photos: Photo[]
} 

type Photo = {
    id: number,
    width: number,
    height: number,
    url: string,
    photographer: string,
    photographer_url: string,
    photographer_id: string,
    avg_color: string,
    src: {
        original: string,
        large2x: string,
        medium: string,
        small: string,
        portriat: string,
        landscape: string,
        tiny: string,
    },
    liked: boolean,
    alt: string
}

const { width} = Dimensions.get("screen");
const _imageWidth = width * 0.7;
const _imageHeight = width * 1.76;
const _spacing = 12;

const BackdropPhoto = ({index, photo, scrollX}: {index: number, photo: Photo, scrollX: SharedValue<number>}) => {
    const stylez = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollX.value,
                [index - 1, index, index + 1],
                [0,1,0]
            )
        }
    })
    return (
        <Animated.Image 
            source={{uri: photo.src.large2x}}
            style={[StyleSheet.absoluteFillObject,stylez]}
            blurRadius={50}
        />
    )
}

const Photo = ({index, item, scrollX}: {index: number, item: Photo, scrollX: SharedValue<number>}) => {
    const stylez = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(scrollX.value,[index - 1, index, index + 1],[1.6,1,1.6])
                },
                {
                    rotate: `${interpolate(scrollX.value, [index - 1, index, index + 1],[15,0,-15])}deg`
                }
            ]
        }
    })
    return (
        <View style={{
            width: _imageWidth,
            height: _imageHeight,
            overflow: 'hidden',
            borderRadius: 16
        }}> 
            <Animated.Image 
                source={{uri: item.src.large2x}}
                style={[{flex: 1}, stylez]}
            />
        </View>
    )
}



const PexelsWallpaper = () => {
    const {data, isLoading} = useQuery<SearchPayload>({
        queryKey: ["wallpapers"],
        queryFn: async () => {
            const res = await fetch("https://api.pexels.com/v1/search?query=people",{
                headers: {
                  'Authorization': apikey
                }
                })
                .then(resp => {
                   return resp.json()
                })
            // console.log(res)
            return res
        }
    })

    const scrollX = useSharedValue(0);
    const onScoll = useAnimatedScrollHandler((e) => {
        scrollX.value = e.contentOffset.x / (_imageWidth + _spacing )
    })

    if(isLoading){
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size={"large"}/>
            </View>
        )
    }

  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={[StyleSheet.absoluteFillObject]}>
        {
            data?.photos.map((photo, index) => (
                <BackdropPhoto key={index} index={index} photo={photo} scrollX={scrollX} />
            ))
        }
      </View>
      <Animated.FlatList 
        data={data?.photos}
        keyExtractor={item => String(item.id)}
        horizontal
        snapToInterval={_imageWidth + _spacing}
        decelerationRate='fast'
        style={{flexGrow : 0}}
        contentContainerStyle={{
            gap: _spacing,
            paddingHorizontal: ( width - _imageWidth)/ 2
        }}
        renderItem={({item, index}) => (
            <Photo index={index} item={item} scrollX={scrollX} />
        )}
        onScroll={onScoll}
        scrollEventThrottle={1000 / 60}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

export default PexelsWallpaper
