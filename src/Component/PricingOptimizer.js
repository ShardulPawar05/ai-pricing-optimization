import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, AlertCircle, Sparkles, BarChart3 } from 'lucide-react';

export default function PricingOptimizer() {
  const [formData, setFormData] = useState({
    productName: '',
    cost: '',
    currentPrice: '',
    category: 'electronics',
    targetMargin: '30',
  });
  
  const [competitors, setCompetitors] = useState([
    { name: '', price: '' }
  ]);
  
  const [demandData, setDemandData] = useState({
    currentDemand: 'medium',
    seasonality: 'none',
    marketTrend: 'stable'
  });
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDemandChange = (e) => {
    setDemandData({ ...demandData, [e.target.name]: e.target.value });
  };

  const handleCompetitorChange = (index, field, value) => {
    const newCompetitors = [...competitors];
    newCompetitors[index][field] = value;
    setCompetitors(newCompetitors);
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: '', price: '' }]);
  };

  const removeCompetitor = (index) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const analyzePrice = async () => {
    if (!formData.productName || !formData.cost || !formData.currentPrice) {
      alert('Please fill in product name, cost, and current price');
      return;
    }

    setLoading(true);
    
    const validCompetitors = competitors.filter(c => c.name && c.price);
    
    // Calculate basic metrics
    const cost = parseFloat(formData.cost);
    const currentPrice = parseFloat(formData.currentPrice);
    const targetMargin = parseFloat(formData.targetMargin);
    
    // Calculate optimal price based on target margin
    const optimalPriceCalc = cost * (1 + targetMargin / 100);
    
    // Calculate competitor average if available
    let competitorAvg = 0;
    if (validCompetitors.length > 0) {
      competitorAvg = validCompetitors.reduce((sum, c) => sum + parseFloat(c.price), 0) / validCompetitors.length;
    }
    
    // Adjust optimal price based on market conditions
    let demandMultiplier = 1;
    if (demandData.currentDemand === 'high') demandMultiplier = 1.1;
    if (demandData.currentDemand === 'very-high') demandMultiplier = 1.15;
    if (demandData.currentDemand === 'low') demandMultiplier = 0.95;
    
    let seasonMultiplier = 1;
    if (demandData.seasonality === 'peak') seasonMultiplier = 1.1;
    if (demandData.seasonality === 'holiday') seasonMultiplier = 1.15;
    if (demandData.seasonality === 'off-peak') seasonMultiplier = 0.95;
    
    // Calculate final optimal price
    let finalOptimalPrice = optimalPriceCalc * demandMultiplier * seasonMultiplier;
    
    // Adjust based on competitors if available
    if (competitorAvg > 0) {
      finalOptimalPrice = (finalOptimalPrice + competitorAvg) / 2;
    }
    
    finalOptimalPrice = Math.round(finalOptimalPrice);
    
    const currentMargin = ((currentPrice - cost) / cost * 100).toFixed(1);
    const optimalMargin = ((finalOptimalPrice - cost) / cost * 100).toFixed(1);
    
    // Simulate AI analysis with a slight delay
    setTimeout(() => {
      const mockAnalysis = {
        optimalPrice: finalOptimalPrice,
        priceRange: {
          min: Math.round(finalOptimalPrice * 0.95),
          max: Math.round(finalOptimalPrice * 1.05)
        },
        currentPriceAnalysis: currentPrice < finalOptimalPrice 
          ? `Your current price of ₹${currentPrice} is below the optimal price point. You're leaving money on the table and potentially undervaluing your product in the Indian market.`
          : currentPrice > finalOptimalPrice * 1.1
          ? `Your current price of ₹${currentPrice} is significantly above the optimal range. This may reduce sales volume and make you less competitive against other Indian sellers.`
          : `Your current pricing of ₹${currentPrice} is relatively well-positioned for the Indian market.`,
        competitivePosition: validCompetitors.length > 0
          ? `Based on ${validCompetitors.length} competitor(s), your optimal price positions you competitively. The average competitor price is ₹${Math.round(competitorAvg)}. ${finalOptimalPrice < competitorAvg ? 'You can capture price-sensitive Indian customers while maintaining healthy margins.' : 'Your positioning is premium, which works if you can demonstrate superior value.'}`
          : `Without competitor data, your pricing is based primarily on cost-plus strategy with target margin of ${targetMargin}%. Consider researching competitors on Amazon.in, Flipkart, and local markets.`,
        recommendations: [
          currentPrice < finalOptimalPrice 
            ? `Increase your price to ₹${finalOptimalPrice}. Many Indian MSMEs underprice - don't leave profits behind.`
            : `Maintain competitive pricing while focusing on value differentiation.`,
          demandData.currentDemand === 'high' || demandData.currentDemand === 'very-high'
            ? `High demand detected - you have pricing power. Consider testing the upper range of ₹${Math.round(finalOptimalPrice * 1.05)}.`
            : `Focus on building demand through marketing before increasing prices significantly.`,
          `Monitor competitors regularly on major Indian platforms (Amazon.in, Flipkart, Meesho) and adjust accordingly.`,
          `Consider regional pricing variations - metros like Mumbai, Delhi can support 5-10% higher prices than Tier 2/3 cities.`,
          demandData.seasonality === 'peak' || demandData.seasonality === 'holiday'
            ? `You're in peak/holiday season - implement dynamic pricing to maximize revenue during festivals like Diwali, Holi.`
            : `Plan pricing strategy for upcoming Indian festivals and sale seasons (Republic Day, Independence Day, Diwali).`
        ],
        risks: [
          `Price-sensitive Indian market: Sudden large increases (>15%) may shock customers. Implement gradual changes.`,
          validCompetitors.length < 2
            ? `Limited competitor data may lead to suboptimal pricing. Research at least 3-5 direct competitors.`
            : `Close competitor monitoring needed - Indian e-commerce is highly competitive with frequent price wars.`,
          `GST considerations: Ensure your pricing accounts for 18% GST (or applicable rate for your category).`,
          currentMargin < 20
            ? `Current margin of ${currentMargin}% is low. Indian MSMEs need 25-40% margins to sustain operations and growth.`
            : ``,
          `Payment method costs: Factor in 2-3% for digital payment gateway charges, COD handling costs.`
        ].filter(r => r !== ''),
        profitProjection: {
          currentMargin: parseFloat(currentMargin),
          optimalMargin: parseFloat(optimalMargin),
          revenueImpact: currentPrice < finalOptimalPrice
            ? `Potential revenue increase of ${Math.round(((finalOptimalPrice - currentPrice) / currentPrice * 100))}% per unit`
            : currentPrice > finalOptimalPrice * 1.1
            ? `Consider price reduction to boost volume and market share`
            : `Stable pricing with room for optimization`
        },
        marketStrategy: demandData.marketTrend === 'growing' || demandData.marketTrend === 'rapidly-growing'
          ? `Growing market detected! Focus on capturing market share while maintaining healthy margins. Invest in marketing and distribution. Consider partnerships with Indian e-commerce platforms for wider reach.`
          : demandData.marketTrend === 'declining'
          ? `Declining market requires careful pricing. Focus on customer retention, value-added services, and differentiation rather than aggressive pricing. Look for niche segments within Indian market.`
          : `Stable market - compete on value proposition, customer service, and brand building. Emphasize quality and reliability to justify pricing in price-sensitive Indian market.`,
        actionItems: [
          `Update pricing to ₹${finalOptimalPrice} within next 7-14 days`,
          `Research 5 direct competitors on Amazon.in and Flipkart - document their pricing, offers, and positioning`,
          `Calculate all-in costs including GST (${formData.category === 'food' ? '5%' : '18%'}), platform fees (15-20%), logistics (5-8%)`,
          `Set up price monitoring alerts for top 3 competitors using tools or manual tracking`,
          `Test pricing in different Indian regions/cities if selling across multiple locations`,
          `Plan promotional calendar around Indian festivals: Diwali (Oct-Nov), Holi (Mar), Independence/Republic Days`
        ]
      };
      
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 2000);
  };

  const getPriceStatus = () => {
    if (!analysis || !formData.currentPrice) return null;
    
    const current = parseFloat(formData.currentPrice);
    const optimal = analysis.optimalPrice;
    const diff = ((current - optimal) / optimal * 100).toFixed(1);
    
    if (Math.abs(diff) < 5) {
      return { status: 'optimal', color: 'bg-green-100 text-green-800', message: 'Well priced!' };
    } else if (current < optimal) {
      return { status: 'underpriced', color: 'bg-red-100 text-red-800', message: `Underpriced by ${Math.abs(diff)}%` };
    } else {
      return { status: 'overpriced', color: 'bg-yellow-100 text-yellow-800', message: `Above optimal by ${diff}%` };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Pricing Optimizer</h1>
          </div>
          <p className="text-gray-600">Smart pricing recommendations for Indian MSMEs • All prices in ₹ INR</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Product Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Premium Wireless Headphones"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Production Cost * (₹)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="4000"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Price * (₹)
                  </label>
                  <input
                    type="number"
                    name="currentPrice"
                    value={formData.currentPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="6500"
                    step="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="food">Food & Beverage</option>
                    <option value="beauty">Beauty & Personal Care</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports & Outdoors</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Margin (%)
                  </label>
                  <input
                    type="number"
                    name="targetMargin"
                    value={formData.targetMargin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Market Conditions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Market Conditions
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Demand Level
                </label>
                <select
                  name="currentDemand"
                  value={demandData.currentDemand}
                  onChange={handleDemandChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="very-high">Very High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seasonality Factor
                </label>
                <select
                  name="seasonality"
                  value={demandData.seasonality}
                  onChange={handleDemandChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="none">No Seasonality</option>
                  <option value="peak">Peak Season</option>
                  <option value="off-peak">Off-Peak Season</option>
                  <option value="holiday">Holiday Period</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Market Trend
                </label>
                <select
                  name="marketTrend"
                  value={demandData.marketTrend}
                  onChange={handleDemandChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="declining">Declining</option>
                  <option value="stable">Stable</option>
                  <option value="growing">Growing</option>
                  <option value="rapidly-growing">Rapidly Growing</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Competitor Analysis
          </h2>
          
          <div className="space-y-3">
            {competitors.map((competitor, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={competitor.name}
                  onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Competitor name"
                />
                <input
                  type="number"
                  value={competitor.price}
                  onChange={(e) => handleCompetitorChange(index, 'price', e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Price (₹)"
                  step="1"
                />
                {competitors.length > 1 && (
                  <button
                    onClick={() => removeCompetitor(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addCompetitor}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              + Add Competitor
            </button>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-6">
          <button
            onClick={analyzePrice}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5" />
                Optimize Pricing
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Optimal Price Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-1">Optimal Price</div>
                  <div className="text-4xl font-bold">₹{analysis.optimalPrice}</div>
                  {getPriceStatus() && (
                    <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${getPriceStatus().color}`}>
                      {getPriceStatus().message}
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-1">Price Range</div>
                  <div className="text-2xl font-semibold">
                    ₹{analysis.priceRange.min} - ₹{analysis.priceRange.max}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-1">Optimal Margin</div>
                  <div className="text-4xl font-bold">{analysis.profitProjection.optimalMargin}%</div>
                </div>
              </div>
            </div>

            {/* Analysis Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Current Price Analysis</h3>
                <p className="text-gray-700">{analysis.currentPriceAnalysis}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Competitive Position</h3>
                <p className="text-gray-700">{analysis.competitivePosition}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-2 text-gray-700">
                    <span className="text-indigo-600">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Risks to Consider
              </h3>
              <ul className="space-y-2">
                {analysis.risks.map((risk, index) => (
                  <li key={index} className="flex gap-2 text-gray-700">
                    <span className="text-amber-600">⚠</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategy and Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Market Strategy</h3>
                <p className="text-gray-700">{analysis.marketStrategy}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Action Items</h3>
                <ul className="space-y-2">
                  {analysis.actionItems.map((action, index) => (
                    <li key={index} className="flex gap-2 text-gray-700">
                      <span className="text-green-600">✓</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Profit Projection */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Profit Impact</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Current Margin</div>
                  <div className="text-2xl font-bold text-gray-900">{analysis.profitProjection.currentMargin}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Optimal Margin</div>
                  <div className="text-2xl font-bold text-green-600">{analysis.profitProjection.optimalMargin}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Revenue Impact</div>
                  <div className="text-lg font-semibold text-gray-900">{analysis.profitProjection.revenueImpact}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}