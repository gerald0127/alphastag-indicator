//@version=5
indicator(title='Alphastag - Rook Trading Group', shorttitle='AlphaStag', overlay=true)
//inputs
src = ohlc4
anchor = 1
bblength = 30
mult = 2.0
tf_mult = 1
sens = 3
 
//BB calculations
sma_1 = ta.sma(src, bblength * tf_mult)
ema_1 = ta.ema(src, bblength)
basis = anchor == 1 ? sma_1 : ema_1
dev = mult * ta.stdev(src, bblength * tf_mult)
upper = basis + dev
lower = basis - dev
upper1 = basis + dev / 2
lower1 = basis - dev / 2
upper3 = basis + dev * 1.5
lower3 = basis - dev * 1.5
 
//Bollinger Band - Price Breaks
up_bar = open <= close
up_break = high - upper
low_break = low - lower
up_break1 = high - upper1
low_break1 = low - lower1
up_break3 = high - upper3
low_break3 = low - lower3
 
 
// Squeeze - Expansion calulations, (C) 2019-now Joris Duyck (JD)
price = ohlc4 > basis ? (high - basis) * 2 / dev : (low - basis) * 2 / dev
sq = -15 - dev / ta.highest(dev, 50) * 5
top = dev / ta.lowest(dev, 50) - 21
color_1 = color.new(color.teal, 0)
falling_1 = ta.falling(top, 1)
color_2 = color.new(color.teal, 25)
sq_color = ta.rising(sq, 1) ? top < sq ? color_1 : falling_1 ? color_2 : color.olive : color.olive
color_3 = color.new(color.green, 0)
color_4 = color.new(color.red, 0)
falling_2 = ta.falling(sq, 1)
color_5 = color.new(color.green, 25)
color_6 = color.new(color.red, 25)
top_color = ta.rising(top, 1) ? top > sq ? price >= 0 ? color_3 : color_4 : falling_2 ? price >= 0 ? color_5 : color_6 : color.orange : color.orange
 
bounce1 = sq_color == color.new(color.teal, 25)
boost1 = top_color == color.new(color.green, 25) or top_color == color.new(color.red, 25) or not(ta.rising(sq, 1) and ta.falling(top, 1))
bounce2 = sq_color == color.new(color.teal, 0)
boost2 = top_color == color.new(color.green, 0) or top_color == color.new(color.red, 0)
 
len1 = 2
multi = input.float(0, title="What was the previous ath?")
multi1 = input.float(1, title = "How many coins/shares do you have?")
multi2 = input.float(0,title = "where would sell the remaining?")
 
under = ta.crossunder(price, 0)
under1 = ta.crossunder(price, 1)
under2 = ta.crossunder(price, 2)
under3 = ta.crossunder(price, 3)
conund = price[2] - 1 > 2
conund1 = price[2] - 1 > 1
conund2 = price[2] - 1 > 0
conund3 = price[2] - 1 > -1
color candle_color = na
a = input.bool(true, "sell")
green = close > open
red = close < open
b = close < multi + (multi * 0.65)
c = close > multi
e = under3 and conund
h = under2 and conund1
vwph = ta.valuewhen(e, bar_index, 0)
vwpl = ta.valuewhen(h, bar_index, 0)
var int counterph = 0
var int counterpl = 0
f = counterph < 1
g = counterph[1] < 1
len = 13
src2 = close
offset = 0
out = ta.sma(src2, len)
cond = ta.crossunder(close, out)
if a
    candle_color := switch
        b  => color.black
        cond => color.red
        under2 and conund1=> color.red
        under3 and conund=> color.red
        green => color.black
        red => color.black
barcolor(candle_color, editable = true)
 
 
var float sum = 0
del = (multi1 - sum) <= 0
 
q =  e and not b and not (g and ta.barssince(e)) and not del 
r =  h and not b and not (g and ta.barssince(e)) and not del 
if q
    counterph += 1
    label.new(bar_index, high, str.tostring(counterph), style=label.style_label_down, color=color.rgb(255, 82, 82, 100), textcolor=color.rgb(255, 255, 255, 100))
    if counterph <= 2 and counterph >= 1.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.25, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.25
        alert("SELL " + str.tostring((multi1 - sum)*0.25) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterph <= 3 and counterph >= 2.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.3, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.3
        alert("SELL " + str.tostring((multi1 - sum)*0.3) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterph <= 4 and counterph >= 3.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.4, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.4
        alert("SELL " + str.tostring((multi1 - sum)*0.4) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterph <= 5 and counterph >= 4.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.5, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.5
        alert("SELL " + str.tostring((multi1 - sum)*0.5) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterph <= 6 and counterph >= 5.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.6, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.6
        alert("SELL " + str.tostring((multi1 - sum)*0.6) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterph <= 7 and counterph >= 6.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.7, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.7
        alert("SELL " + str.tostring((multi1 - sum)*0.7) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterph <= 8 and counterph >= 7.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.8, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.8
        alert("SELL " + str.tostring((multi1 - sum)*0.8) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterph <= 9 and counterph >= 8.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.9, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.9
        alert("SELL " + str.tostring((multi1 - sum)*0.9) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterph <= 10 and counterph >= 9.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum), '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum)
        alert("SELL " + str.tostring(multi1 - sum) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
if r
    counterpl += 1
    label.new(bar_index, high, str.tostring(counterpl), style=label.style_label_down, color=color.red, textcolor=color.white)
    if counterpl <= 1 and counterpl >= 0.5
        label.new(bar_index, high,"Sell " +  str.tostring(multi1 * 0.15, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=multi1 * 0.15 //add after each if condition
        alert("SELL " + str.tostring((multi1 - sum)*0.15) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 2 and counterpl >= 1.5
        label.new(bar_index, high,"Sell " +  str.tostring((multi1 -sum) * 0.2, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.20
        alert("SELL " + str.tostring((multi1 - sum)*0.2) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 3 and counterpl >= 2.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum) * 0.3, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.30
        alert("SELL " + str.tostring((multi1 - sum)*0.3) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 4 and counterpl >= 3.5
        label.new(bar_index, high,"Sell " +  str.tostring((multi1 -sum) * 0.4, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.40
        alert("SELL " + str.tostring((multi1 - sum)*0.4) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 5 and counterpl >= 4.5
        label.new(bar_index, high,"Sell " +  str.tostring((multi1 -sum) * 0.5, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.50
        alert("SELL " + str.tostring((multi1 - sum)*0.5) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 6 and counterpl >= 5.5
        label.new(bar_index, high,"Sell " +  str.tostring((multi1 -sum) * 0.6, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.60
        alert("SELL " + str.tostring((multi1 - sum)*0.6) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 7 and counterpl >= 6.5
        label.new(bar_index, high,"Sell " +  str.tostring((multi1 -sum) * 0.7, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.70
        alert("SELL " + str.tostring((multi1 - sum)*0.7) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 8 and counterpl >= 7.5
        label.new(bar_index, high,"Sell " +  str.tostring((multi1 -sum) * 0.8, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) *0.80
        alert("SELL " + str.tostring((multi1 - sum)*0.8) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 9 and counterpl >= 8.5
        label.new(bar_index, high,"Sell " +  str.tostring((multi1 -sum) * 0.9, '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) * 0.90 //typ o multi1*0.0 ?
        alert("SELL " + str.tostring((multi1 - sum)*0.9) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    if counterpl <= 10 and counterpl >= 9.5
        label.new(bar_index, high,"Sell " + str.tostring((multi1 -sum), '#.##'), style=label.style_label_down, color=color.red, textcolor=color.white)
        sum+=(multi1 -sum) 
        alert("SELL " + str.tostring(multi1 - sum) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
 
variable = switch counterpl
    1 => 0.15
    2 => 0.2
    3 => 0.3
    4 => 0.4
    5 => 0.5
    6 => 0.6
    7 => 0.7
    8 => 0.8
    9 => 0.9
    10 => 1
bong = math.max(variable,0)
variable1 = switch counterph
    1 => 0
    2 => 0.25
    3 => 0.3
    4 => 0.4
    5 => 0.5
    6 => 0.6
    7 => 0.7
    8 => 0.8
    9 => 0.9
    10 => 1
 
bong1 = math.max(variable1,0)
bong2 = math.max(bong1, bong)
v = switch counterpl
    1 => (multi1 - sum[1]) * 0.15
    2 => (multi1 - sum[1]) *0.2
    3 => (multi1 - sum[1]) *0.3
    4 => (multi1 - sum[1]) *0.4
    5 => (multi1 - sum[1]) *0.5
    6 => (multi1 - sum[1]) *0.6
    7 => (multi1 - sum[1]) *0.7
    8 => (multi1 - sum[1]) *0.8
    9 => (multi1 - sum[1]) *0.9
    10 => (multi1 - sum[1]) *1
bo = math.max(v,1)
v1 = switch counterph
    1 => 0
    2 => (multi1 - sum[1]) *0.25
    3 => (multi1 - sum[1]) *0.3
    4 => (multi1 - sum[1]) *0.4
    5 => (multi1 - sum[1]) *0.5
    6 => (multi1 - sum[1]) *0.6
    7 => (multi1 - sum[1]) *0.7
    8 => (multi1 - sum[1]) *0.8
    9 => (multi1 - sum[1]) *0.9
    10 => (multi1 - sum[1]) *1
 
bo1 = math.max(v1,1)
bo2 = math.max(bo1, bo)
 
 
var int countDot = 0    
var int countSqr = 0    
if cond and not b and countDot>0
    countSqr += 1
 
if (q or r) and not b 
    countDot += 1
    countSqr:=0
 
//////////  Choose which block of code: show recent labels >>> older labels as increase 'labsToShow' number
labsToShow = 100
var label haha =na 
var array<label> hahaArr = array.new<label>(0)

 
w = cond and not b and countSqr ==1

if w
    sum+=(multi1 - sum[1])  * (bong2 + 0.15)

if w
    haha := label.new(bar_index, high,"Sell " + str.tostring((multi1 - sum[1])  * (bong2 + 0.15)), style=label.style_label_down, color=color.new(color.red,0), textcolor=color.white)
    array.push(hahaArr, haha)
    if array.size(hahaArr) > labsToShow
        label.delete(array.shift(hahaArr))
    alert("SELL " + str.tostring((multi1 - sum[1])  * (bong2 + 0.15)) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
sellall = ta.crossunder(close, multi * 0.75) and not (g and ta.barssince(e)) and not del and counterph >=1 
if sellall 
    alert("SELL " + str.tostring(multi1 - sum) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
    label.new(bar_index, high,"Sell " + str.tostring(multi1 - sum), style=label.style_label_down, color=color.new(color.red,0), textcolor=color.white)
sellall1 = ta.crossunder(close,multi2) and not (g and ta.barssince(e)) and not del and counterph >=1
if sellall1  
    label.new(bar_index, high,"Sell " + str.tostring(multi1 - sum), style=label.style_label_down, color=color.new(color.red,0), textcolor=color.white)
    sum+=(multi1 -sum)
    alert("SELL " + str.tostring(multi1 - sum) +str.tostring(syminfo.ticker)+" @ "+ str.tostring(close, format.mintick)+".",alert.freq_once_per_bar)
paul = input.bool(false,'excel data')
plot(paul ? sum - sum[1] : na,title = "sales", color=color.rgb(54, 58, 69, 100))
plot(paul ? (sum - sum[1]) * close : na,title = "sold", color=color.rgb(54, 58, 69, 100))